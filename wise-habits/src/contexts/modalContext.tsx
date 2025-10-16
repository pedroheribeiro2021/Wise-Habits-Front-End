import React, { ReactNode, useContext, useState } from 'react'
import { createContext } from 'react'

interface IModalContext {
  isCreateHabitsModalOpen: boolean
  setCreateHabitsModalOpen: React.Dispatch<React.SetStateAction<any>>
}

interface IModalProps {
  children: ReactNode
}

export const ModalContext = createContext<IModalContext>({} as IModalContext)

export const ModalProvider = ({ children }: IModalProps) => {
  const [isCreateHabitsModalOpen, setCreateHabitsModalOpen] = useState(false)

  return (
    <ModalContext.Provider
      value={{
        isCreateHabitsModalOpen,
        setCreateHabitsModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => useContext(ModalContext)
