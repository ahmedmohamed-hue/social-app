import create from 'zustand'

interface GlobalState {
  emailAlert: boolean
  closeEmailAlert: () => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  emailAlert: true,
  closeEmailAlert: () => set(() => ({ emailAlert: false })),
}))

export * from './layoutStore'
export default useGlobalStore
