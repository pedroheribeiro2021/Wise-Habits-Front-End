/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

// Cria uma instância do Axios
export const api = axios.create({
    baseURL: 'https://wise-habits-back-end.vercel.app',
    // baseURL: 'http://localhost:3003',
    timeout: 5000,
})

// Exporta uma função para configurar interceptadores, que será chamada de um componente
export const setupInterceptors = (navigate: any) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error.response.data.message)
        console.log(error)

      if (
        error.response.status === 401 &&
        error.response.data.message === 'Token expired. Please login again.'
      ) {
        // alert('Sessão expirada. Faça o login novamente.')
        navigate('/')
      }
      return Promise.reject(error)
    },
  )
}
