/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useHabitsContext } from '../../contexts/habitsContext'
import { api } from '../../services/api'
import CreateHabitsModal from '../../components/modal/createHabitsModal'
import { useModalContext } from '../../contexts/modalContext'
import { FaCheckDouble, FaCheck } from 'react-icons/fa'
import BottomBar from '../../components/bottomNavigationBar'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MdOutlineCancel } from 'react-icons/md'
import { DashboardStyle } from './style'
import { MdArrowRight } from 'react-icons/md'
import { MdArrowLeft } from 'react-icons/md'
import { VscCalendar } from 'react-icons/vsc'

interface iStatus {
  id: number
  statuses: { [key: string]: number }
}

export interface iHabits {
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
  // const [today, setToday] = useState<string>('2024-02-08')
  const [selectedTab, setSelectedTab] = useState('home')
  const [selectedDate, setSelectedDate] = useState(new Date())
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

  useEffect(() => {
    getHabits()
    setCurrentDate(getCurrentDate())
    console.log(today)
    console.log(habits)
  }, [])

  const getCurrentDate = (): string => {
    const today = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } as const
    return today.toLocaleDateString('pt-BR', options)
  }

  // const shouldRenderHabit = (habit: iHabits): boolean => {
  //   const currentDay = new Date().toLocaleDateString('pt-BR', { weekday: 'long' })
  //   console.log(currentDay)
  //   return habit.weekDays.includes(currentDay)
  // }

  const shouldRenderHabit = (habit: iHabits): boolean => {
    const currentDay = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase()
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

  const handleTabChange = (event: unknown, newValue: React.SetStateAction<string>) => {
    setSelectedTab(newValue)
  }

  // const CheckIcons = () => {
  //   const formattedSelectedDate = selectedDate.toISOString().split('T')[0]

  //   return (
  //     <>
  //       {habits?.map((habit) => {
  //         return (
  //           shouldRenderHabit(habit) && (
  //             <div key={habit.id}>
  //               {habit.statuses.map((status) => {
  //                 const statusValue = status.statuses[formattedSelectedDate] // Usa a data formatada para verificação
  //                 return (
  //                   <div key={status.id}>
  //                     {statusValue === 10 ? (
  //                       <FaCheckDouble style={{ color: 'green' }} />
  //                     ) : (
  //                       statusValue === 5 && <FaCheck style={{ color: 'green' }} />
  //                     )}
  //                   </div>
  //                 )
  //               })}
  //             </div>
  //           )
  //         )
  //       })}
  //     </>
  //   )
  // }

  const navigateToPreviousDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() - 1)
    setSelectedDate(new Date(currentDate)) // Manter como objeto Date
  }

  const navigateToNextDay = () => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + 1)
    setSelectedDate(new Date(currentDate)) // Manter como objeto Date
  }

  return (
    <DashboardStyle>
      <CreateHabitsModal />
      <h2>Início</h2>
      <VscCalendar style={{ margin: '8px 0', fontSize: 60 }} />
      <div>
        {/* <p>Data Atual: {currentDate}</p> */}
        <div className="date_container">
          <button onClick={navigateToPreviousDay} style={{ marginRight: 5 }}>
            {/* Dia Anterior */}
            <MdArrowLeft style={{ color: 'white', fontSize: 60 }} />
          </button>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="center"
          />
          <button onClick={navigateToNextDay} style={{ marginLeft: 5 }}>
            {/* Próximo Dia */}
            <MdArrowRight style={{ color: 'white', fontSize: 60 }} />
          </button>
        </div>
        <ul>
          {habits?.map(
            (habit, i) =>
              shouldRenderHabit(habit) && (
                // console.log(habit.weekDays)
                <li key={i} className="habit_card">
                  <div>
                    <div className="header">
                      <span style={{ fontWeight: 'bold' }}>{habit.name}</span>
                      {habit.statuses.map((status) => {
                        const statusDate = selectedDate.toISOString().split('T')[0]
                        const statusValue = status.statuses[statusDate]
                        if (statusValue === 10) {
                          return <FaCheckDouble key={status.id} style={{ color: 'green' }} />
                        } else if (statusValue === 5) {
                          return <FaCheck key={status.id} style={{ color: 'green' }} />
                        } else if (statusValue === 0) {
                          return <MdOutlineCancel key={status.id} style={{ color: 'red' }} />
                        }
                        return null
                      })}
                    </div>
                    <p>{habit.description}</p>
                    <div className="status">
                      <div className="status_container">
                        <label htmlFor={`concluido${i}`}>Concluído</label>
                        <input
                          // checked={habit.statuses.statusValue === 10}
                          checked={habit.statuses.some(
                            (status) =>
                              status.statuses[selectedDate.toISOString().split('T')[0]] === 10,
                          )}
                          type="radio"
                          name={`habito${i}`}
                          id={`concluido${i}`}
                          onChange={() =>
                            updateHabitStatus(
                              habit.id,
                              selectedDate.toISOString().split('T')[0],
                              10,
                            )
                          }
                        />
                      </div>
                      <div className="status_container">
                        <label htmlFor={`parcialmenteConcluido${i}`}>Parcialmente concluído</label>
                        <input
                          // checked={habit.statuses.statusValue === 5}
                          checked={habit.statuses.some(
                            (status) =>
                              status.statuses[selectedDate.toISOString().split('T')[0]] === 5,
                          )}
                          type="radio"
                          name={`habito${i}`}
                          id={`parcialmenteConcluido${i}`}
                          onChange={() =>
                            updateHabitStatus(habit.id, selectedDate.toISOString().split('T')[0], 5)
                          }
                        />
                      </div>
                      <div className="status_container">
                        <label htmlFor={`naoConcluido${i}`}>Não concluído</label>
                        <input
                          // checked={habit.statuses.statusValue === 0}
                          // value={habit.statuses.statusValue}
                          checked={habit.statuses.some(
                            (status) =>
                              status.statuses[selectedDate.toISOString().split('T')[0]] === 0,
                          )}
                          type="radio"
                          name={`habito${i}`}
                          id={`naoConcluido${i}`}
                          onChange={() =>
                            updateHabitStatus(habit.id, selectedDate.toISOString().split('T')[0], 0)
                          }
                        />
                      </div>
                    </div>
                    {/* {CheckIcons()} */}
                  </div>
                </li>
              ),
          )}
        </ul>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          // width: '100%',
          // backgroundColor: '#f8f9fa', // Exemplo de cor de fundo
          // borderTop: '1px solid #dee2e6', // Exemplo de borda
          zIndex: 100, // Garante que a barra fique acima de outros elementos
        }}
      >
        <button className="add_button" type="button" onClick={() => setCreateHabitsModalOpen(true)}>
          +
        </button>
      </div>
      <BottomBar onTabChange={handleTabChange} value={selectedTab} />
    </DashboardStyle>
  )
}

export default Dashboard
