/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

// Cria uma instância do Axios
export const api = axios.create({
  baseURL: 'https://api-wise-habits-back-end.onrender.com',
  // baseURL: 'http://localhost:3004',
  timeout: 10000,
})

// Variável para controlar se já estamos redirecionando
let isRedirecting = false

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Interceptor error:', error.response?.data)

    // Verifica se é erro 401 (Unauthorized) - Token inválido/expirado
    if (error.response?.status === 401) {
      const errorMessage = error.response.data.message

      // Verifica se o erro é relacionado ao token
      if (
        errorMessage?.includes('token') ||
        errorMessage?.includes('Token') ||
        errorMessage?.includes('invalid') ||
        errorMessage?.includes('expired')
      ) {
        // Previne múltiplos redirecionamentos
        if (!isRedirecting) {
          isRedirecting = true

          // Limpa o localStorage
          localStorage.removeItem('@token')
          localStorage.removeItem('@id')

          // Mostra alerta para o usuário
          alert('Sessão expirada. Por favor, faça login novamente.')

          // Redireciona para login
          window.location.href = '/' // Usamos window.location para forçar recarregamento
        }
      }
    }

    return Promise.reject(error)
  },
)

// Função para configurar o interceptor com navigate (mantenha a existente se precisar)
export const setupInterceptors = (navigate: any) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Interceptor with navigate error:', error.response?.data)

      if (error.response?.status === 401) {
        const errorMessage = error.response.data.message

        if (
          errorMessage?.includes('token') ||
          errorMessage?.includes('Token') ||
          errorMessage?.includes('invalid') ||
          errorMessage?.includes('expired')
        ) {
          if (!isRedirecting) {
            isRedirecting = true

            localStorage.removeItem('@token')
            localStorage.removeItem('@id')

            alert('Sessão expirada. Por favor, faça login novamente.')
            navigate('/')
          }
        }
      }
      return Promise.reject(error)
    },
  )
}
