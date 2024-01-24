/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup'
import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/userContext'

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
    <>
      <Link to={'/'}>Voltar</Link>
      <form onSubmit={handleSubmit(submit)}>
        <h3>Crie sua conta</h3>
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" placeholder="Digite aqui seu nome" {...register('name')} />

        <label htmlFor="">Email</label>
        <input type="email" id="email" placeholder="Digite aqui seu Email" {...register('email')} />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          placeholder="Digite aqui seu Senha"
          {...register('password')}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </>
  )
}

export default Register
