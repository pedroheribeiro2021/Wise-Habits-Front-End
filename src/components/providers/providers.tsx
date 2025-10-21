import React, { ReactNode } from 'react'
import { UserProvider } from '../../contexts/userContext'
import { ModalProvider } from '../../contexts/modalContext'
import { HabitsProvider } from '../../contexts/habitsContext'

interface iProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: iProvidersProps) => {
  return (
    <ModalProvider>
      <UserProvider>
        <HabitsProvider>{children}</HabitsProvider>
      </UserProvider>
    </ModalProvider>
  )
}
