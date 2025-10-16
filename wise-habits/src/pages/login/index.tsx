import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useContext } from 'react'
import { UserContext } from '../../contexts/userContext'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { LoginStyle } from './style'
import logo from '../../assets/Wise habits.png'

interface iDataLogin {
  email: string
  password: string
}

const formSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

const Login = () => {
  const { userLogin } = useContext(UserContext)

  const { register, handleSubmit } = useForm<iDataLogin>({
    resolver: yupResolver(formSchema),
  })

  const submit = (data: iDataLogin) => {
    console.log(data)
    userLogin(data)
  }

  return (
    <LoginStyle>
      <img src={logo} className="logo" />
      <form onSubmit={handleSubmit(submit)}>
        <h3>Login</h3>
        <label>
          Email:
          <input type="email" id="email" placeholder="Digite seu E-mail" {...register('email')} />
        </label>
        <label>
          Senha:
          <input type="password" id="password" placeholder="Senha" {...register('password')} />
        </label>
        <button type="submit">Entrar</button>
        <span>Ainda não possui uma conta? </span>
        <Link to={'/register'} relative="path" style={{ textDecoration: 'underline' }}>
          Cadastre-se
        </Link>
      </form>
    </LoginStyle>
  )
}

export default Login
