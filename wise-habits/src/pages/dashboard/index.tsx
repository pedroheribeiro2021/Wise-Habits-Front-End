/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useHabitsContext } from '../../contexts/habitsContext'
import { api } from '../../services/api'

interface iHabits {
  id: string
  name: string
  description: string
  priority: number
  status: number
}

const Dashboard = () => {
  const [habits, setHabits] = useState<iHabits[] | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')

  const getHabits = async (): Promise<void> => {
    try {
      const { data } = await api.get('/habits')
      console.log(data)
      setHabits(data)
    } catch (error) {
      console.error(error)
    }
  }

  const getCurrentDate = (): string => {
    const today = new Date()
    console.log(today)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const
    return today.toLocaleDateString('pt-BR', options)
  }

  useEffect(() => {
    getHabits()
    setCurrentDate(getCurrentDate())
  }, [])

  console.log('Current habits state:', habits)

  return (
    <div>
      <h2>Home</h2>
      <div>
        <p>Data Atual: {currentDate}</p>
        <ul>
          {habits?.map((habit, i) => (
            <li key={i}>
              <div>
                <span>{habit.name}</span>
                <input type="radio" name={`habito${i}`} id={`concluido${i}`} />
                <label htmlFor={`concluido${i}`}>Concluído</label>
                <input type="radio" name={`habito${i}`} id={`parcialmenteConcluido${i}`} />
                <label htmlFor={`parcialmenteConcluido${i}`}>Parcialmente concluído</label>
                <input type="radio" name={`habito${i}`} id={`naoConcluido${i}`} />
                <label htmlFor={`naoConcluido${i}`}>Não concluído</label>
              </div>
              <p>{habit.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button>
          +
        </button>
      </div>
    </div>
  )
}

export default Dashboard
