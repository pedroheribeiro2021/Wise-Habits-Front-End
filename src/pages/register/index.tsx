/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/userContext'
import logo from '../../assets/Wise habits.png'
import { RegisterStyle } from './style'

interface iDataRegister {
  name: string
  email: string
  password: string
}

const RegisterSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

const Register = () => {
  const { userRegister } = useContext(UserContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<iDataRegister>({
    resolver: yupResolver(RegisterSchema),
  })

  const submit = async (data: iDataRegister) => {
    console.log(data)
    userRegister(data)
  }

  return (
    <RegisterStyle>
      <img src={logo} className="logo" />
      <form onSubmit={handleSubmit(submit)}>
        <h3>Crie sua conta</h3>
        <label htmlFor="name">
          Nome
          <input type="text" id="name" placeholder="Digite aqui seu nome" {...register('name')} />
        </label>

        <label htmlFor="">
          Email
          <input
            type="email"
            id="email"
            placeholder="Digite aqui seu Email"
            {...register('email')}
          />
        </label>

        <label htmlFor="password">
          Senha
          <input
            type="password"
            id="password"
            placeholder="Digite aqui seu Senha"
            {...register('password')}
          />
        </label>
        <button type="submit">Cadastrar</button>
        <Link to={'/'} style={{ textDecoration: 'underline' }}>
          Voltar
        </Link>
      </form>
    </RegisterStyle>
  )
}

export default Register
