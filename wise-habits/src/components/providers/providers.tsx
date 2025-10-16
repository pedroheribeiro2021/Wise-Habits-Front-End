import React, { ReactNode } from 'react'
import { UserProvider } from '../../contexts/userContext'

interface iProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: iProvidersProps) => {
  return <UserProvider>{children}</UserProvider>
}
