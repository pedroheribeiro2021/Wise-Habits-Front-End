/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import BottomBar from '../../components/bottomNavigationBar'
import DatePicker from 'react-datepicker'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import { ReportsStyle } from './style'
import { api } from '../../services/api'
import { iHabits } from '../dashboard'
// import { format } from 'date-fns'

interface iStatus {
  id: number
  statuses: { [key: string]: number }
}

interface HabitData {
  id: string
  name: string
  statuses: iStatus[]
}

interface DateStatus {
  date: string
  completed: number
  partial: number
  notCompleted: number
}

const getFirstDayOfMonth = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

// Defina a função para obter o último dia do mês
const getLastDayOfMonth = () => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0)
}

const HabitsChart = () => {
  const [selectedTab, setSelectedTab] = useState('graph')
  const [startDate, setStartDate] = useState(getFirstDayOfMonth()) // Inicializa com o primeiro dia do mês corrente
  const [endDate, setEndDate] = useState(getLastDayOfMonth()) // Inicializa com o último dia do mês corrente
  const [habits, setHabits] = useState<iHabits[] | null>(null)
  // const { getHabits } = useHabitsContext()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const safeHabits = habits || []

  const token = localStorage.getItem('@token')

  const getHabits = async (): Promise<void> => {
    try {
      const { data } = await api.get('/habits', {
        headers: { authorization: `Bearer ${token}` },
      })
      setHabits(data)
      console.log(habits)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getHabits()
  }, [])

  const handleTabChange = (event: unknown, newValue: React.SetStateAction<string>) => {
    setSelectedTab(newValue)
  }

  // Função para processar os dados e estruturá-los para o gráfico
  const processDataForChart = (data: HabitData[]) => {
    const dates: Record<string, DateStatus> = {}

    data.forEach((habit) => {
      // Verifica se habit.statuses existe e é um array antes de proceder
      if (habit.statuses && Array.isArray(habit.statuses)) {
        habit.statuses.forEach((status) => {
          // Verifica se status.statuses existe e é um objeto antes de iterar sobre ele
          if (status.statuses && typeof status.statuses === 'object') {
            Object.entries(status.statuses).forEach(([date, value]) => {
              console.log(date)
              console.log(value)

              if (!dates[date]) {
                dates[date] = { date, completed: 0, partial: 0, notCompleted: 0 }
              }
              if (value === 10) {
                dates[date].completed += 1
              } else if (value === 5) {
                dates[date].partial += 1
              } else {
                dates[date].notCompleted += 1
              }
            })
          }
        })
      }
    })
    console.log(Object.values(dates))
    return Object.values(dates)
  }
  console.log(safeHabits)
  console.log(startDate)
  console.log(endDate)
  console.log(habits)

  // @ts-ignore
  const filteredHabits = safeHabits.map((habit: { statuses: any[] }) => ({
    ...habit,
    statuses: habit.statuses
      .flatMap((status: { id: any; statuses: { [s: string]: unknown } | ArrayLike<unknown> }) => ({
        id: status.id,
        statuses: Object.fromEntries(
          Object.entries(status.statuses).filter(
            ([date]) => new Date(date) >= startDate && new Date(date) <= endDate,
          ),
        ),
      }))
      .filter((status: { statuses: object }) => Object.keys(status.statuses).length > 0),
  }))

  // const filteredHabitsWithStatusInRange = habits
  //   ?.map((habit) => {
  //     const filteredStatuses = habit.statuses
  //       .map((status) => {
  //         const filteredStatusEntries = Object.entries(status.statuses).filter(([date]) => {
  //           const statusDate = new Date(date)
  //           return statusDate >= startDate && statusDate <= endDate
  //         })

  //         return {
  //           ...status,
  //           statuses: Object.fromEntries(filteredStatusEntries),
  //         }
  //       })
  //       .filter((status) => Object.keys(status.statuses).length > 0)

  //     return {
  //       ...habit,
  //       statuses: filteredStatuses,
  //     }
  //   })
  //   .filter((habit) => habit.statuses.length > 0)

  const filteredHabitsForSelectedDate = habits
    ?.map((habit) => {
      const filteredStatuses = habit.statuses.filter((status) => {
        return Object.keys(status.statuses).some((date) => {
          return date === selectedDate.toISOString().split('T')[0]
        })
      })

      return {
        ...habit,
        statuses: filteredStatuses,
      }
    })
    .filter((habit) => habit.statuses.length > 0)

  // @ts-ignore
  const chartData = processDataForChart(filteredHabits)
  console.log(filteredHabitsForSelectedDate?.length)

  return (
    <ReportsStyle>
      <div className="datePicker-Container">
        <DatePicker
          showIcon
          toggleCalendarOnIconClick
          selected={startDate}
          // @ts-ignore
          onChange={(date: React.SetStateAction<Date>) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          // showMonthYearPicker
          isClearable
          showWeekNumbers
        />
        <DatePicker
          showIcon
          toggleCalendarOnIconClick
          selected={endDate}
          // @ts-ignore
          onChange={(date: React.SetStateAction<Date>) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
          // showMonthYearPicker
          isClearable
          showWeekNumbers
        />
      </div>
      <div className="chart">
        <BarChart
          width={400}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Concluídos" />
          <Bar dataKey="partial" stackId="a" fill="#8884d8" name="Parcialmente Concluídos" />
          <Bar dataKey="notCompleted" stackId="a" fill="#ffc658" name="Não Concluídos" />
        </BarChart>
        <BottomBar onTabChange={handleTabChange} value={selectedTab} />
      </div>
      <div className="custom-datepicker">
        <DatePicker
          inline // Esta prop faz o DatePicker ser exibido diretamente, sem necessidade de um campo de entrada
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          highlightDates={[new Date()]} // Destaca o dia atual
          dateFormat="MM/yyyy"
          showFullMonthYearPicker
        />
      </div>
      <div style={{ marginTop: 15 }}>
        {/* <ul> */}
        {filteredHabitsForSelectedDate?.length ? (
          filteredHabitsForSelectedDate?.map((habit, i) => (
            <li key={i}>
              <div>
                {/* <span style={{ fontWeight: 'bold' }}>{habit.name}</span> */}
                <ul>
                  {habit.statuses.map((status, index) => {
                    return (
                      <li key={index}>
                        {Object.entries(status.statuses).map(([, value], idx) => {
                          let conclusion
                          let color
                          switch (value) {
                            case 10:
                              conclusion = 'Concluído'
                              color = '#82ca9d'
                              break
                            case 5:
                              conclusion = 'Parcialmente Concluído'
                              color = '#8884d8'
                              break
                            default:
                              conclusion = 'Não Concluído'
                              color = '#ffc658'
                          }
                          // const formattedDate = format(new Date(date), 'dd/MM/yyyy')
                          return (
                            <div key={idx}>
                              <div style={{ backgroundColor: color }}>
                                {' '}
                                {/* {formattedDate} - {conclusion} */}
                                <span>
                                  {habit.name} - {conclusion}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          ))
        ) : (
          <span style={{ display: 'flex', justifyContent: 'center', marginTop: 65 }}>
            Não há hábitos finalizados :({' '}
          </span>
        )}
        {/* </ul> */}
      </div>
    </ReportsStyle>
  )
}

export default HabitsChart
