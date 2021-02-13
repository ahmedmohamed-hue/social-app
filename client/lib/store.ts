import createStore from 'zustand'

type theme = "light" | "dark"

type UiStore = {
  drawerOpen: boolean
  closeDrawer: () => void
  openDrawer: () => void
  theme: string
  toggleTheme: () => void
  setTheme: (theme: theme) => void
}

export const useUIStore = createStore<UiStore>(set => ({
  drawerOpen: false,
  closeDrawer: () => set(() => ({ drawerOpen: false })),
  openDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  theme: "dark",
  toggleTheme: () => {
    set((state) => {
      console.log("wtf")
      if (state.theme === "light") {
        localStorage.setItem("theme", "dark")
        return { theme: "dark" }
      } else {
        localStorage.setItem("theme", "light")
        return { theme: "light" }
      }
    })
  },
  setTheme: (theme) => set({ theme })
}))