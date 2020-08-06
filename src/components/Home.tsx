import React from 'react'
import { Link } from 'react-router-dom'

import { Meal, Category } from './../types'
import './../stylesheets/Home.css'

import fb from './../firebaseConfig'
const db = fb.firestore()

interface CustomProps {
  user: boolean;
  categories: Category[];
  meals: Meal[];
}

const Home: React.FC<CustomProps> = (props) => {
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
          <Link to='/auth'>{props.user ? 'Выйти' : 'Войти'}</Link>
        </button>
      </nav>

      {props.categories.map((category, index) => {
        return (
          <div className='Category' key={index}>
            <h2 className='Title'>{category.title}</h2>
            {props.meals.filter(meal => {
              if (meal.categories) {
                const mealCategoriesRefs = meal.categories.map((mealCategory) => String(mealCategory.ref))
                return mealCategoriesRefs.includes(category.id)
              } else return false
            }).map((meal, index) => {
                return (
                  <div className='Meal' key={index}>
                    <picture>
                      <img className='Pic' src={`https://ucarecdn.com/${meal.uploadcareId}/-/resize/x360/-/format/auto/`} alt={meal.title} />
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
                      ? <button className='EditBtn' id='specialBtn'><Link to={`/edit/${meal.id}`}><span role='img' aria-label='edit'>✏️</span></Link></button>
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
