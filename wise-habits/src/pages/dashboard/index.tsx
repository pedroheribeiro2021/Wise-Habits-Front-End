import React, { useEffect, useState } from 'react'
import { useHabitsContext } from '../../contexts/habitsContext'
import { api } from '../../services/api'
import CreateHabitsModal from '../../components/modal/createHabitsModal'
import { useModalContext } from '../../contexts/modalContext'
import { FaCheckDouble, FaCheck } from 'react-icons/fa'

interface iHabits {
  id: string
  name: string
  description: string
  priority: number
  status: number
  weekDays: string[]
}

const Dashboard = () => {
  const [habits, setHabits] = useState<iHabits[] | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const { setCreateHabitsModalOpen } = useModalContext()

  const getHabits = async (): Promise<void> => {
    try {
      const { data } = await api.get('/habits')
      setHabits(data)
    } catch (error) {
      console.error(error)
    }
  }

  const getCurrentDate = (): string => {
    const today = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const
    return today.toLocaleDateString('pt-BR', options)
  }

  const shouldRenderHabit = (habit: iHabits): boolean => {
    const currentDay = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase()
    return habit.weekDays.map((day) => day.toLowerCase()).includes(currentDay)
  }

  const updateHabitStatus = async (habitId: string, status: number): Promise<void> => {
    try {
      await api.patch(`/habits/${habitId}`, { status })
      // Atualiza localmente o estado dos hábitos após a atualização no backend
      setHabits((prevHabits) => {
        if (prevHabits) {
          return prevHabits.map((habit) => (habit.id === habitId ? { ...habit, status } : habit))
        }
        return prevHabits
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getHabits()
    setCurrentDate(getCurrentDate())
  }, [])

  return (
    <div>
      <CreateHabitsModal />
      <h2>Home</h2>
      <div>
        <p>Data Atual: {currentDate}</p>
        <ul>
          {habits?.map(
            (habit, i) =>
              shouldRenderHabit(habit) && (
                <li key={i}>
                  <div>
                    <span>{habit.name}</span>
                    <input
                      type="radio"
                      name={`habito${i}`}
                      id={`concluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, 10)}
                    />
                    <label htmlFor={`concluido${i}`}>Concluído</label>
                    <input
                      type="radio"
                      name={`habito${i}`}
                      id={`parcialmenteConcluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, 5)}
                    />
                    <label htmlFor={`parcialmenteConcluido${i}`}>Parcialmente concluído</label>
                    <input
                      type="radio"
                      name={`habito${i}`}
                      id={`naoConcluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, 0)}
                    />
                    <label htmlFor={`naoConcluido${i}`}>Não concluído</label>
                    {habit.status === 10 ? (
                      <FaCheckDouble style={{ color: 'green' }} />
                    ) : (
                      habit.status === 5 && <FaCheck style={{ color: 'green' }} />
                    )}
                  </div>
                  <p>{habit.description}</p>
                </li>
              ),
          )}
        </ul>
      </div>
      <div>
        <button type="button" onClick={() => setCreateHabitsModalOpen(true)}>
          +
        </button>
      </div>
    </div>
  )
}

export default Dashboard
