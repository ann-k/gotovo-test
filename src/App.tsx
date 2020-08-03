import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './App.css'
import db from './firebaseConfig'
import { Meal, Category } from './types'
import Form from './Form'

function App() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const getCategories = () => {
    db.collection('categories').onSnapshot(async querySnapshot => {
      const newCategories: Category[] = []
      const observer = await querySnapshot.forEach(doc => {
        const newCat: Category = doc.data()
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

  const createOrUpdateMeal = async (e: any, activeMealId: string) => {
    e.preventDefault()

    // If meal exists, find it by id and update
    if (activeMealId) {
      const mealRef = db.collection('meals').doc(activeMealId)
      const res = await mealRef.set({
        title: e.target.title.value,
        price: e.target.price.value,
        emoji: e.target.emoji.value,
        kind: e.target.kind.value,
        state: e.target.state.value,
      })
    } else {
      // Add new meal with auto generated id
      const res = await db.collection('meals').add({
        // Take info from user input
        title: e.target.title.value,
        price: e.target.price.value,
        emoji: e.target.emoji.value,
        kind: e.target.kind.value,
        state: e.target.state.value,
      })
    }
  }

  useEffect(() => {
    getMeals()
    getCategories()
  }, [])

  return (
    <Router>
      <div className='App'>
        <button>Войти</button>

        <Switch>
          <Route path='/create'>
            <Form createOrUpdateMeal={createOrUpdateMeal} action={'create'} />
          </Route>
          <Route path='/edit/:mealTitle'>
            <Form createOrUpdateMeal={createOrUpdateMeal} action={'edit'}/>
          </Route>
        </Switch>

        <button>
          <Link to='/create'>Добавить блюдо</Link>
        </button>

        {categories.map((cat, index) => {
          return (
            <div key={index}>
              <h2>{cat.title}</h2>
              {meals.filter(meal => true) // TODO: Filter meals by categories
                .map((meal, index) => {
                  return (
                    <div className='Meal' key={index}>
                      <h4>{meal.emoji} {meal.title}</h4>
                      <p>{meal.price} ₽</p>
                      <button><Link to={`/edit/${meal.title}`}>Редактировать блюдо</Link></button>
                      <br/>
                    </div>
                  )
                })
              }
            </div>
          )
        })}
      </div>
    </Router>
  )
}

export default App
