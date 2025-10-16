import { AxiosError } from 'axios'
import React, { ReactNode, SetStateAction, useState, useEffect, useContext, createContext } from 'react'
import { useNavigate } from 'react-router'
import { api } from '../services/api'
import { toast } from 'react-toastify'

interface iApiError {
  message: string
}

interface iUserProps {
  children: ReactNode
}

interface iUser {
  id: string
  name: string
  email: string
}

interface iDataLogin {
  email: string
  password: string
}

interface iDataRegister {
  name: string
  email: string
  password: string
}

export interface iUserContext {
  user: iUser | null
  setCurrentRoute: React.Dispatch<SetStateAction<string | null>>
  userLogin: (data: iDataLogin) => void
  userRegister: (data: iDataRegister) => void
}

export const UserContext = createContext<iUserContext>({} as iUserContext)

export const UserProvider = ({ children }: iUserProps) => {
  const [user, setUser] = useState<iUser | null>(null)
  const [currentRoute, setCurrentRoute] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('@token')
      if (token) {
        try {
          const resp: iUser = await api.get(`/profile`, {
            headers: { Authorization: 'Bearer ' + token },
          })
          setUser(resp)
          navigate('/dashboard')
          console.log(resp)
        } catch (error) {
          localStorage.removeItem('@token')
          navigate('/')
        }
      }
    })()
  }, [])

  const userLogin = (data: iDataLogin) => {
    api
      .post(`/login `, data)
      .then((resp) => {
        console.log(resp.data)
        setUser(resp.data)
        localStorage.setItem('@token', resp.data.token)
        localStorage.setItem('@id', resp.data.id)
        navigate('/home')
        toast.success('Login efetuado com sucesso!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
      .catch((err) => {
        console.log(err)
        toast.error('Erro de credenciais!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
  }

  const userRegister = async (data: iDataRegister) => {
    await api
      .post(`/user`, data)
      .then((resp) => {
        console.log(resp)
        toast.success('Cadastro efetuado com sucesso!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        navigate('/')
      })
      .catch((err) => {
        const requestError = err as AxiosError<iApiError>
        console.log(err)
        toast.error(requestError.response?.data.message, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
  }

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userRegister,
        user,
        setCurrentRoute,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
