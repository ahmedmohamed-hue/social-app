import React, { useState } from 'react'

const useMenu = () => {
  const [anchorEl, setAnchorlEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorlEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorlEl(null)
  }

  return { anchorEl, handleClick, handleClose }
}

export default useMenu
