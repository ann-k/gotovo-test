import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Meal, Category } from './../types'
import fb from './../firebaseConfig'
const db = fb.firestore()
const axios = require('axios').default

interface CustomProps {
  user: boolean;
}

const Home: React.FC<CustomProps> = (props) => {
  const [meals, setMeals] = useState<Meal[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const getCategories = () => {
    db.collection('categories').onSnapshot(async querySnapshot => {
      const newCategories: Category[] = []
      const observer = await querySnapshot.forEach(doc => {
        const newCat: Category = doc.data() as Category
        newCategories.push(newCat)
      })
      setCategories(newCategories)
    }, err => console.log(`Encountered error: ${err}`))
  }

  const getMeals = () => {
    db.collection('meals').onSnapshot(async querySnapshot => {
      const newMeals: Meal[] = []
      const observer = await querySnapshot.forEach(doc => {
        const newMeal: Meal = doc.data()
        newMeals.push(newMeal)
      })
      setMeals(newMeals)
    }, err => console.log(`Encountered error: ${err}`))
  }

  useEffect(() => {
    getMeals()
    getCategories()
  }, [])

  return (
    <div className='Home'>
      <nav className='Nav'>
        <button>
        {props.user
          ? <Link to='/create'>Добавить блюдо</Link>
          : null
        }
        </button>

        <button>
          <Link to='/auth'>Войти</Link>
        </button>
      </nav>

      {categories.map((category, index) => {
        return (
          <div className='Category' key={index}>
            <h2 className='Title'>{category.title}</h2>
            {meals.filter(meal => true) // TODO: Filter meals by categories
              .map((meal, index) => {
                // TODO: Get image link from uploadecare with uuid
                return (
                  <div className='Meal' key={index}>
                    <picture>
                      <img className='Pic' src='test.jpg' alt='Food' />
                    </picture>
                    <div className='Info'>
                      <div className='Title'>
                        <h3>{meal.title} <small className='Measure'>{meal.measure && meal.measure.value} {meal.measure && meal.measure.unit}</small></h3>
                      </div>
                      <div>
                        <button className='Price'>{meal.price && meal.price + ' ₽'}</button>
                        <span className='Emoji'>{meal.emoji} </span>
                      </div>
                    </div>
                    {props.user
                      ? <button className='EditBtn' id='specialBtn'><Link to={`/edit/${meal.title}`}><span role='img' aria-label='edit'>✏️</span></Link></button>
                      : null
                    }
                  </div>
                )
              })
            }
          </div>
        )
      })}
    </div>
  )
}

export default Home
