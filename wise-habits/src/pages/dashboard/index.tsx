/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useHabitsContext } from '../../contexts/habitsContext'
import { api } from '../../services/api'
import CreateHabitsModal from '../../components/modal/createHabitsModal'
import { useModalContext } from '../../contexts/modalContext'
import { FaCheckDouble, FaCheck } from 'react-icons/fa'
import BottomBar from '../../components/bottomNavigationBar'

interface iStatus {
  id: number
  date: string
  statusValue: number
}

interface iHabits {
  id: string
  name: string
  description: string
  priority: number
  statuses: iStatus[]
  weekDays: string[]
}

const Dashboard = () => {
  const [habits, setHabits] = useState<iHabits[] | null>(null)
  const [currentDate, setCurrentDate] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState('home')
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
    const currentDay = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
    console.log(currentDay)
    return habit.weekDays.includes(currentDay)
  }

  const updateHabitStatus = async (
    habitId: string,
    statusId: number,
    date: string,
    statusValue: number,
  ): Promise<void> => {
    // console.log({ statusValue })
    // const test = Object.values(date)
    console.log(habitId)
    console.log(statusId)
    console.log(date)
    try {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0]
      console.log(formattedDate)

      if (date === formattedDate) {
        console.log('true')
        await api.patch(`/habits/${statusId}/status`, { statusValue })
      }

      await api.post(`/habits/${habitId}/status`, { formattedDate, statusValue })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getHabits()
    console.log(habits)
    setCurrentDate(getCurrentDate())
  }, [])

  const handleTabChange = (event: unknown, newValue: React.SetStateAction<string>) => {
    setSelectedTab(newValue)
  }

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
                // console.log(habit.weekDays)
                <li key={i}>
                  <div>
                    <span>{habit.name}</span>
                    <input
                      // checked={habit.statuses.statusValue === 10}
                      type="radio"
                      name={`habito${i}`}
                      id={`concluido${i}`}
                      onChange={() =>
                        updateHabitStatus(
                          habit.id,
                          habit.statuses[0]?.id,
                          habit.statuses[0]?.date,
                          10,
                        )
                      }
                    />
                    <label htmlFor={`concluido${i}`}>Concluído</label>
                    <input
                      // checked={habit.statuses.statusValue === 5}
                      type="radio"
                      name={`habito${i}`}
                      id={`parcialmenteConcluido${i}`}
                      onChange={() =>
                        updateHabitStatus(
                          habit.id,
                          habit.statuses[0]?.id,
                          habit.statuses[0]?.date,
                          5,
                        )
                      }
                    />
                    <label htmlFor={`parcialmenteConcluido${i}`}>Parcialmente concluído</label>
                    <input
                      // checked={habit.statuses.statusValue === 0}
                      // value={habit.statuses.statusValue}
                      type="radio"
                      name={`habito${i}`}
                      id={`naoConcluido${i}`}
                      onChange={() =>
                        updateHabitStatus(
                          habit.id,
                          habit.statuses[0]?.id,
                          habit.statuses[0]?.date,
                          0,
                        )
                      }
                    />
                    <label htmlFor={`naoConcluido${i}`}>Não concluído</label>
                    {habit.statuses[0].statusValue === 10 ? (
                      <FaCheckDouble style={{ color: 'green' }} />
                    ) : (
                      habit.statuses[0].statusValue === 5 && <FaCheck style={{ color: 'green' }} />
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
      <BottomBar onTabChange={handleTabChange} value={selectedTab} />
    </div>
  )
}

export default Dashboard
