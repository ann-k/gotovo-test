import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Widget } from '@uploadcare/react-widget'

import { Meal } from './../types'
import './../stylesheets/Form.css'

interface CustomProps {
  createOrUpdateMeal: (e: any, activeMeal: Meal) => void;
  meals?: Meal[];
}

const Form: React.FC<CustomProps> = (props) => {
  const [activeMeal, setActiveMeal] = useState<Meal>({})
  const closeRef = useRef<HTMLAnchorElement>(null)
  const { mealId } = useParams()

  const handleSubmit = (e: any) => {
    props.createOrUpdateMeal(e, activeMeal)
    if (closeRef.current instanceof HTMLAnchorElement) closeRef.current.click()
  }

  useEffect(() => {
    if (props.meals) {
      const activeMeal: Meal = props.meals.filter(meal => meal.id === mealId)[0]
      setActiveMeal(activeMeal)
    }
  }, [])

  return (
    <form className='Form' onSubmit={(e) => handleSubmit(e)}>
      <button id='specialBtn'><Link to='/' ref={closeRef}>×</Link></button>

      <input type='text' name='title' required
      defaultValue={activeMeal.title && activeMeal.title} placeholder='Название' />

      <select name='categories' required>
        <option value=''>Категория</option>
        <option value='B3CBHatjmrm8BhfjqojS'>Завтрак</option>
        <option value='knVkORG3FGIdU0H4lRCX'>Обед</option>
      </select>

      <input type='number' name='measureValue' required
      defaultValue={activeMeal.measure && activeMeal.measure.value} placeholder='Количество' />
      <input type='text' name='measureUnit' required
      defaultValue={activeMeal.measure && activeMeal.measure.unit} placeholder='г' />

      <input type='number' name='price' required
      defaultValue={activeMeal.price && activeMeal.price}  placeholder='Цена' />

      <input type='text' name='emoji'
      defaultValue={activeMeal.emoji && activeMeal.emoji}  placeholder='Эмоджи ❤️' />

      <label>Изображение</label>
      <Widget onChange={(file) => setActiveMeal({...activeMeal, uploadcareId: file.uuid})} publicKey='123123bb93b5f37445a5' />
      <input type='hidden' role='uploadcare-uploader' />

      <select name='kind'>
        <option value={activeMeal.kind ? activeMeal.kind : ''}>{activeMeal.kind ? activeMeal.kind : 'Тип'}</option>
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
        <option value={activeMeal.state ? activeMeal.state : ''}>{activeMeal.state ? activeMeal.state : 'Состояние'}</option>
        <option value='draft'>Черновик</option>
        <option value='elaborating'>В проработке</option>
        <option value='elaborated'>Проработано</option>
        <option value='public'>Паблик</option>
        <option value='archive'>Архив</option>
      </select>

      <button type='submit' value='submit'>{props.meals ? 'Сохранить' : 'Добавить'}</button>
    </form>
  )
}

export default Form
