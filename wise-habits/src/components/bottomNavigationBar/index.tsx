import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useNavigate } from 'react-router-dom'

interface BottomBarProps {
  onTabChange: (event: React.ChangeEvent<unknown>, newValue: string) => void
  value: string
}

const BottomBar: React.FC<BottomBarProps> = ({ onTabChange, value }) => {
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: string) => {
    navigate(`/${newValue}`)
    onTabChange(event, newValue)
  }
  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '#f8f9fa', // Exemplo de cor de fundo
        borderTop: '1px solid #dee2e6', // Exemplo de borda
        zIndex: 100, // Garante que a barra fique acima de outros elementos
      }}
    >
      <BottomNavigationAction label="Início" icon={<HomeIcon />} value="home" />
      {/* <BottomNavigationAction label="User" icon={<PersonIcon />} value="register" /> */}
      <BottomNavigationAction label="Gráficos" icon={<ShowChartIcon />} value="graph" />
    </BottomNavigation>
  )
}

export default BottomBar
