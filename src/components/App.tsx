import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Meal, Category } from './../types'

import Form from './Form'
import Auth from './Auth'
import Home from './Home'

import fb from './../firebaseConfig'
const db = fb.firestore()

function App() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [user, setUser] = useState<boolean>(localStorage.getItem('user') == 'true' || false)

  const updateUser = (bool: boolean) => {
    setUser(bool)
  }

  const createOrUpdateMeal = (e: any, activeMeal: Meal) => {
    e.preventDefault()

    // Take info from user input
    const data: Meal = {
      title: e.target.title.value,
      price: e.target.price.value,
      measure: {
        unit: e.target.measureUnit.value,
        value: e.target.measureValue.value,
      },
      emoji: e.target.emoji.value,
      uploadcareId: activeMeal.uploadcareId,
      kind: e.target.kind.value,
      state: e.target.state.value,
    }

    // If meal exists, find it by id and update
    if (activeMeal.id) {
      const mealRef = db.collection('meals').doc(activeMeal.id)
      mealRef.set(data)
    } else {
      // Add new meal with auto generated id
      db.collection('meals').add(data)
    }
  }

  const getCategories = () => {
    db.collection('categories').onSnapshot(querySnapshot => {
      const newCategories: Category[] = []
      querySnapshot.forEach(doc => {
        newCategories.push(doc.data() as Category)
      })
      setCategories(newCategories)
    }, err => console.log(`Encountered error: ${err}`))
  }

  const getMeals = () => {
    db.collection('meals').onSnapshot(querySnapshot => {
      const newMeals: Meal[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        newMeals.push({
          ...data,
          id: doc.id,
          // categories: doc.data().categories.map((category: any) => ({
          //   ...category,
         // ...category.ref.get()
          // }))
        })
      })
      setMeals(newMeals)
    }, err => console.log(`Encountered error: ${err}`))
  }

  useEffect(() => {
    getCategories()
    getMeals()
  }, [])

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/auth'>
            <Auth updateUser={updateUser} user={user} />
          </Route>
          <Route path='/create'>
            <Form createOrUpdateMeal={createOrUpdateMeal} />
          </Route>
          <Route path='/edit/:mealId'>
            <Form createOrUpdateMeal={createOrUpdateMeal} meals={meals} />
          </Route>
          <Route path='/'>
            <Home meals={meals} categories={categories} user={user} />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
