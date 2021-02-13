import { Switch } from '@material-ui/core'
import React from 'react'
import { useUIStore } from '../lib/store'

interface SwitchThemeProps {

}

const SwitchTheme: React.FC<SwitchThemeProps> = () => {
  const theme = useUIStore(s => s.theme)
  const handleToggle = useUIStore(s => s.toggleTheme)

  return (
    <Switch onChange={handleToggle} checked={theme === "dark"} />
  )
}

export default SwitchTheme