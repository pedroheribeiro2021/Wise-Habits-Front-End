import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'

interface BottomBarProps {
  onTabChange: (event: React.ChangeEvent<unknown>, newValue: string) => void
  value: string
}

const BottomBar: React.FC<BottomBarProps> = ({ onTabChange, value }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair?')) {
      localStorage.removeItem('@token')
      localStorage.removeItem('@userID')
      navigate('/')
    }
  }

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    // Se for logout, executa a função e retorna sem mudar o estado
    if (newValue === 'logout') {
      handleLogout()
      return // Não chama onTabChange para não alterar o estado visual
    }

    navigate(`/${newValue}`)
    onTabChange(event, newValue)
  }

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6',
        zIndex: 100,
      }}
    >
      <BottomNavigationAction label="Início" icon={<HomeIcon />} value="home" />
      <BottomNavigationAction label="Gráficos" icon={<ShowChartIcon />} value="graph" />
      <BottomNavigationAction
        label="Sair"
        icon={<LogoutIcon />}
        value="logout"
        style={{ color: '#f44336' }} // Cor vermelha para destacar
      />
    </BottomNavigation>
  )
}

export default BottomBar
