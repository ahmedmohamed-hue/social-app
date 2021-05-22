import create from 'zustand'

interface LayoutState {
  drawerIsOpen: boolean
  toggleDrawer: () => void
  onDrawerClose: () => void
}

const useLayoutStore = create<LayoutState>((set) => ({
  drawerIsOpen: false,
  toggleDrawer: () => set((state) => ({ drawerIsOpen: !state.drawerIsOpen })),
  onDrawerClose: () => set(() => ({ drawerIsOpen: false })),
}))

export default useLayoutStore
