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

interface CreateHabitsModalProps {
  onHabitCreated: () => Promise<void> // ← Mantemos como Promise
}

const RegisterSchema = yup.object().shape({
  name: yup.string().required('Título obrigatório'),
  description: yup.string(),
  priority: yup.number().required('É necessário estipular uma prioridade para seu hábito'),
})

const CreateHabitsModal: React.FC<CreateHabitsModalProps> = ({ onHabitCreated }) => {
  const { isCreateHabitsModalOpen, setCreateHabitsModalOpen } = useModalContext()
  const { createHabits } = useHabitsContext()
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false) // ← Estado para loading
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
    formState: { errors },
    reset, // ← Adicionamos reset para limpar o form
  } = useForm<iHabitsRegister>({
    // resolver: yupResolver(RegisterSchema),
  })

  const closeModal = () => {
    setCreateHabitsModalOpen(false)
    reset() // ← Limpa o form ao fechar
    setSelectedWeekDays([]) // ← Limpa os dias selecionados
  }

  const submit = async (data: iHabitsRegister) => {
    // ← Tornamos async
    if (isSubmitting) return // ← Previne múltiplos envios

    setIsSubmitting(true)

    try {
      const habitData = {
        ...data,
        weekDays: selectedWeekDays.map((day) => day.toLowerCase()),
      }

      // 🔥 AGUARDAMOS a criação do hábito
      await createHabits(habitData)

      // 🔥 AGUARDAMOS a atualização do dashboard
      await onHabitCreated()

      console.log(habitData)
      closeModal()
    } catch (error) {
      console.error('Erro ao criar hábito:', error)
    } finally {
      setIsSubmitting(false)
    }
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
        <div className="header">
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
          <label htmlFor="weekDays">Dias da Semana:</label>
          <div>
            {weekDays.map((day) => (
              <React.Fragment key={day}>
                <div className="weekDays">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(day)}
                    checked={selectedWeekDays.includes(day)}
                  />
                  <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                </div>
              </React.Fragment>
            ))}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar'}
          </button>
        </form>
      </div>
    </CreateHabitsModalStyled>
  )
}

export default CreateHabitsModal
