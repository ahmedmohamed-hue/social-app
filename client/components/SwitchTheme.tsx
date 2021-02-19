import Switch from '@material-ui/core/Switch'
import React from 'react'
import { useUIStore } from '../lib/store'

const SwitchTheme: React.FC = () => {
  const theme = useUIStore((s) => s.theme)
  const handleToggle = useUIStore((s) => s.toggleTheme)

  return <Switch onChange={handleToggle} checked={theme === 'dark'} />
}

export default SwitchTheme
