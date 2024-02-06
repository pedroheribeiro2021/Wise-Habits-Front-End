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
  statuses: { [key: string]: number }
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
  const [today, setToday] = useState<string>(new Date().toISOString().split('T')[0])
  // const [today, setToday] = useState<string>('2024-02-06')
  // const [status, setStatus] = useState<boolean>()
  const [selectedTab, setSelectedTab] = useState('home')
  const { setCreateHabitsModalOpen } = useModalContext()

  const token = localStorage.getItem('@token')

  const getHabits = async (): Promise<void> => {
    try {
      const { data } = await api.get('/habits')
      setHabits(data)
      console.log(habits)
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
    date: string,
    statusValue: number,
  ): Promise<void> => {
    console.log(habitId, date, statusValue)
    try {
      // Encontrar o hábito pelo habitId
      const habit = habits?.find((h) => h.id === habitId)

      // Encontrar o status para a data, se existir
      const statusForDate = habit?.statuses.find((status) =>
        Object.prototype.hasOwnProperty.call(status.statuses, date),
      )

      console.log(statusForDate?.id)

      if (statusForDate) {
        // Se encontrarmos um status, atualizamos esse status específico
        await api.patch(
          `/habits/${statusForDate.id}/status`,
          { [date]: statusValue },
          { headers: { authorization: `Bearer ${token}` } },
        )
      } else {
        // Se não encontrarmos um status para essa data, criamos um novo
        await api.post(
          `/habits/${habitId}/status`,
          { statuses: { [date]: statusValue } },
          { headers: { authorization: `Bearer ${token}` } },
        )
      }

      // Atualizar os hábitos após a mudança de status
      await getHabits()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getHabits()
    setCurrentDate(getCurrentDate())
    console.log(today)
  }, [])

  const handleTabChange = (event: unknown, newValue: React.SetStateAction<string>) => {
    setSelectedTab(newValue)
  }

  const CheckIcons = () => {
    return (
      <>
        {habits?.map((habit, i) => {
          return (
            shouldRenderHabit(habit) && (
              <div key={i}>
                {habit.statuses.map((status, index) => {
                  const statusValue = status.statuses[today]
                  return (
                    <div key={index}>
                      {statusValue === 10 ? (
                        <FaCheckDouble style={{ color: 'green' }} />
                      ) : (
                        statusValue === 5 && <FaCheck style={{ color: 'green' }} />
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )
        })}
      </>
    )
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
                      checked={habit.statuses.some((status) => status.statuses[today] === 10)}
                      type="radio"
                      name={`habito${i}`}
                      id={`concluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, today, 10)}
                    />
                    <label htmlFor={`concluido${i}`}>Concluído</label>
                    <input
                      // checked={habit.statuses.statusValue === 5}
                      checked={habit.statuses.some((status) => status.statuses[today] === 5)}
                      type="radio"
                      name={`habito${i}`}
                      id={`parcialmenteConcluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, today, 5)}
                    />
                    <label htmlFor={`parcialmenteConcluido${i}`}>Parcialmente concluído</label>
                    <input
                      // checked={habit.statuses.statusValue === 0}
                      // value={habit.statuses.statusValue}
                      checked={habit.statuses.some((status) => status.statuses[today] === 0)}
                      type="radio"
                      name={`habito${i}`}
                      id={`naoConcluido${i}`}
                      onChange={() => updateHabitStatus(habit.id, today, 0)}
                    />
                    <label htmlFor={`naoConcluido${i}`}>Não concluído</label>
                    {CheckIcons()}
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
