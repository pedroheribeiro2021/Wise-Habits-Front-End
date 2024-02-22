/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import BottomBar from '../../components/bottomNavigationBar'
import { useHabitsContext } from '../../contexts/habitsContext'
import DatePicker from 'react-datepicker'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

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
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

// Defina a função para obter o último dia do mês
const getLastDayOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
}

const HabitsChart = () => {
  const [selectedTab, setSelectedTab] = useState('')
  const [startDate, setStartDate] = useState(getFirstDayOfMonth()); // Inicializa com o primeiro dia do mês corrente
  const [endDate, setEndDate] = useState(getLastDayOfMonth()); // Inicializa com o último dia do mês corrente
  const { habits, getHabits } = useHabitsContext()
  const safeHabits = habits || []

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
  // console.log()
  // @ts-ignore
  const chartData = processDataForChart(filteredHabits)

  return (
    <>
      <div>
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
      <div>
        <BarChart
          width={500}
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
    </>
  )
}

export default HabitsChart
