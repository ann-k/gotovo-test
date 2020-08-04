import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Meal } from './../types'
import './../stylesheets/App.css'

import Form from './Form'
import Auth from './Auth'
import Home from './Home'

import fb from './../firebaseConfig'
const db = fb.firestore()

function App() {
  const createOrUpdateMeal = async (e: any, activeMealId: string, uploadcareId: string) => {
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
      uploadcareId: uploadcareId,
      kind: e.target.kind.value,
      state: e.target.state.value,
    }

    // If meal exists, find it by id and update
    if (activeMealId) {
      const mealRef = db.collection('meals').doc(activeMealId)
      const res = await mealRef.set(data)
    } else {
      // Add new meal with auto generated id
      const res = await db.collection('meals').add(data)
    }
  }

  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route path='/auth'>
            <Auth />
          </Route>
          <Route path='/create'>
            <Form createOrUpdateMeal={createOrUpdateMeal} action={'create'} />
          </Route>
          <Route path='/edit/:mealTitle'>
            <Form createOrUpdateMeal={createOrUpdateMeal} action={'edit'}/>
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
