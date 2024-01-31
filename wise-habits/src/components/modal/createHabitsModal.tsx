/* eslint-disable @typescript-eslint/no-unused-vars */
import * as yup from 'yup'
import React, { useState } from 'react'
import { useModalContext } from '../../contexts/modalContext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AiOutlineClose } from 'react-icons/ai'
import { useHabitsContext } from '../../contexts/habitsContext'
import { CreateHabitsModalStyled } from './style'

interface iHabitsRegister {
  name: string
  description?: string | undefined
  priority: number
  weekDays: { [day: string]: { status: number } }[]
}

const RegisterSchema = yup.object().shape({
  name: yup.string().required('Título obrigatório'),
  description: yup.string(),
  priority: yup.number().required('É necessário estipular uma prioridade para seu hábito'),
})

const CreateHabitsModal = () => {
  const { isCreateHabitsModalOpen, setCreateHabitsModalOpen } = useModalContext()
  const { createHabits } = useHabitsContext()
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([])
  const weekDays = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ]

  const {
    register,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<iHabitsRegister>({
    // resolver: yupResolver(RegisterSchema),
  })

  const closeModal = () => setCreateHabitsModalOpen(false)

  const submit = (data: iHabitsRegister) => {
    const habitData = {
      ...data,
      weekDays: selectedWeekDays.map(day => day.toLowerCase()),
    }
  
    createHabits(habitData)
    console.log(habitData)
    closeModal()
  }
  

  const handleCheckboxChange = (day: string) => {
    if (typeof day !== 'string') {
      console.error('Erro: day não é uma string', day)
      return
    }

    const lowercasedDay = day.toLowerCase()

    if (selectedWeekDays.includes(lowercasedDay)) {
      setSelectedWeekDays(
        selectedWeekDays.filter((selectedDay: string) => selectedDay !== lowercasedDay),
      )
    } else {
      setSelectedWeekDays([...selectedWeekDays, lowercasedDay])
    }
  }

  return (
    <CreateHabitsModalStyled
      isOpen={isCreateHabitsModalOpen}
      onRequestClose={closeModal}
      overlayClassName="modal-overlay"
      className="modal-content"
    >
      <div>
        <div>
          <h2>Criar hábito</h2>
          <button onClick={closeModal}>{<AiOutlineClose />}</button>
        </div>
        <form onSubmit={handleSubmit(submit)}>
          <label htmlFor="name">Título</label>
          <input type="text" id="name" placeholder="Digite aqui o título" {...register('name')} />
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            id="description"
            placeholder="Digite aqui uma breve descrição"
            {...register('description')}
          />
          <label htmlFor="description">Prioridade</label>
          <select id="priority" {...register('priority')}>
            <option value={1}>Alta</option>
            <option value={2}>Moderada</option>
            <option value={3}>Baixa</option>
          </select>
          <label htmlFor="weekDays">Dias da Semana</label>
          <div>
            {weekDays.map((day) => (
              <React.Fragment key={day}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(day)}
                  checked={selectedWeekDays.includes(day)}
                />
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
              </React.Fragment>
            ))}
          </div>
          <button type="submit">Criar</button>
        </form>
      </div>
    </CreateHabitsModalStyled>
  )
}

export default CreateHabitsModal
