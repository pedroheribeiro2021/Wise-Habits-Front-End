/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ReactNode, createContext, useContext, useState } from 'react'
import { api } from '../services/api'

interface iHabitsProps {
  children: ReactNode
}

interface iHabits {
  id: string
  name: string
  description: string
  priority: number
  status: number
}

interface iHabitsCreate {
  name: string
  description?: string | undefined
  priority: number
}

export interface iHabitsContext {
  habits: iHabits | null
  createHabits: (data: iHabitsCreate) => void
  getHabits: () => Promise<void>
}

export const HabitsContext = createContext<iHabitsContext>({
  habits: null,
  createHabits: () => {},
  getHabits: async () => {},
})

export const HabitsProvider = ({ children }: iHabitsProps) => {
  const [habits, setHabits] = useState<iHabits | null>(null)

  const token = localStorage.getItem('@token')
  // const id = localStorage.getItem('id')

  const getHabits = async (): Promise<void> => {
    try {
      const { data } = await api.get('/habits')
      console.log(data)
      setHabits(data)
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const createHabits = async (data: iHabitsCreate) => {
    // const today = new Date()
    // const formattedDate = today.toISOString().split('T')[0]
    console.log(token)
    try {
      // getMoment()
      const resp = await api.post('/habits', data, {
        headers: { authorization: `Bearer ${token}` },
      })
      console.log(resp.data)
      setHabits(resp.data)

      // const habitStatus = await api.post(`/habits/${resp.data.id}/status`, {
      //   statuses: { [formattedDate]: 0 }
      // }, {
      //   headers: { authorization: `Bearer ${token}` },
      // })
      // console.log(habitStatus.data)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <HabitsContext.Provider value={{ createHabits, habits, getHabits }}>
      {children}
    </HabitsContext.Provider>
  )
}

export const useHabitsContext = () => useContext(HabitsContext)
