/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import BottomBar from '../../components/bottomNavigationBar'
import { useHabitsContext } from '../../contexts/habitsContext'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

interface StatusEntry {
  date: string // Data no formato YYYY-MM-DD
  status: number // Status, onde 0 = não concluído, 5 = parcialmente concluído, 10 = concluído
}

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

const HabitsChart = () => {
  const [selectedTab, setSelectedTab] = useState('')
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
  // console.log()
  // @ts-ignore
  const chartData = processDataForChart(safeHabits)

  return (
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
  )
}

export default HabitsChart
