import { useState } from 'react'

const useModal = () => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return [{ open, handleClose }, handleOpen] as const
}

export default useModal
