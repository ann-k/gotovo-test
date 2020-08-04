import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Widget } from '@uploadcare/react-widget'

import { Meal } from './../types'
import fb from './../firebaseConfig'
const db = fb.firestore()

interface CustomProps {
  createOrUpdateMeal: (e: any, activeMealId: string, uploadcareId: string) => void;
  action: string;
}

const Form: React.FC<CustomProps> = (props) => {
  const [placeholder, setPlaceholder] = useState<Meal>({})
  const [activeMealId, setActiveMealId] = useState<string>('')
  const [uploadcareId, setUploadcareId] = useState<string>('')
  const closeRef = useRef<HTMLAnchorElement>(null)
  const { mealTitle } = useParams()

  const getPlaceholders = async () => {
    const snapshot = await db.collection('meals').where('title', '==', mealTitle).get()
    if (snapshot.empty) {
      console.log('No matching documents.')
      return
    }

    snapshot.forEach(doc => {
      setPlaceholder(doc.data())
      setActiveMealId(doc.id)
    })
  }

  const handleSubmit = (e: any) => {
    props.createOrUpdateMeal(e, activeMealId, uploadcareId)
    if (closeRef.current instanceof HTMLAnchorElement) closeRef.current.click()
  }

  const getUploadcareId = (file: any) => {
    setUploadcareId(file.uuid)
  }

  useEffect(() => {
    if (props.action === 'edit') getPlaceholders()
  }, [])

  return (
    <form className='Form' onSubmit={(e) => handleSubmit(e)}>
      <button id='specialBtn'><Link to='/' ref={closeRef}>×</Link></button>

      <input type='text' name='title' required
      defaultValue={placeholder.title && placeholder.title} placeholder='Название'></input>

      <input type='number' name='measureValue'
      defaultValue={placeholder.measure && placeholder.measure.value} placeholder='Количество'></input>
      <input type='text' name='measureUnit'
      defaultValue={placeholder.measure && placeholder.measure.unit} placeholder='г'></input>

      <input type='number' name='price'
      defaultValue={placeholder.price && placeholder.price}  placeholder='Цена'></input>

      <input type='text' name='emoji'
      defaultValue={placeholder.emoji && placeholder.emoji}  placeholder='Эмоджи ❤️'></input>

      <label>Изображение</label>
      <Widget onChange={(file) => getUploadcareId(file)} publicKey='123123bb93b5f37445a5' />
      <input type='hidden' role='uploadcare-uploader' />

      <select name='kind'>
        <option value={placeholder.kind ? placeholder.kind : ''}>{placeholder.kind ? placeholder.kind : 'Тип'}</option>
        <option value='drink'>Напиток</option>
        <option value='hotDrink'>Горячий напиток</option>
        <option value='soup'>Суп</option>
        <option value='salad'>Салат</option>
        <option value='hot'>Горячее</option>
        <option value='breakfast'>Завтрак</option>
        <option value='sauce'>Соус</option>
        <option value='pastry'>Десерт</option>
        <option value='garnish'>Гарнир</option>
      </select>

      <select name='state'>
        <option value={placeholder.state ? placeholder.state : ''}>{placeholder.state ? placeholder.state : 'Состояние'}</option>
        <option value='draft'>Черновик</option>
        <option value='elaborating'>В проработке</option>
        <option value='elaborated'>Проработано</option>
        <option value='public'>Паблик</option>
        <option value='archive'>Архив</option>
      </select>

      <button type='submit' value='submit'>{props.action === 'create' ? 'Добавить' : 'Сохранить'}</button>
    </form>
  )
}

export default Form
