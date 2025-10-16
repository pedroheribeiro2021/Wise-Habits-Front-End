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
    <BottomNavigation value={value} onChange={handleChange}>
      <BottomNavigationAction label="Home" icon={<HomeIcon />} value="home" />
      <BottomNavigationAction label="User" icon={<PersonIcon />} value="register" />
      <BottomNavigationAction label="Gráfico" icon={<ShowChartIcon />} value="graph" />
    </BottomNavigation>
  )
}

export default BottomBar
