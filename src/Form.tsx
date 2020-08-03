import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Meal } from './types'
import db from './firebaseConfig'

interface CustomProps {
  createOrUpdateMeal: (e: any, activeMealId: string) => void;
  action: string;
}

const Form: React.FC<CustomProps> = (props) => {
  const [placeholder, setPlaceholder] = useState<Meal>({})
  const [activeMealId, setActiveMealId] = useState<string>('')
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

  useEffect(() => {
    if (props.action === 'edit') getPlaceholders()
  }, [])

  const handleSubmit = (e: any) => {
    props.createOrUpdateMeal(e, activeMealId)
    if (closeRef.current instanceof HTMLAnchorElement) closeRef.current.click()
  }

  return (
    <form className='Form' onSubmit={(e) => handleSubmit(e)}>
      <button id='closeBtn'><Link to='/' ref={closeRef}>×</Link></button>
        <label>Название</label>
        <input type='text' name='title' required
        defaultValue={placeholder.title ? placeholder.title : ''}></input>

        <label>Цена</label>
        <input type='text' name='price'
        defaultValue={placeholder.price ? placeholder.price : ''}></input>

        <label>Эмоджи</label>
        <input type='text' name='emoji'
        defaultValue={placeholder.emoji ? placeholder.emoji : ''}></input>

        <label>Тип</label>
        <select name='kind'>
          <option value={placeholder.kind ? placeholder.kind : ''}>{placeholder.kind ? placeholder.kind : 'Выбрать'}</option>
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

        <label>Состояние</label>
        <select name='state'>
          <option value={placeholder.state ? placeholder.state : ''}>{placeholder.state ? placeholder.state : 'Выбрать'}</option>
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
