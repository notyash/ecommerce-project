import { create } from 'zustand'
import { api } from '../utils/axios'
import { User } from '../types'

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null, // this is the state
    setUser: (user) => set({user}),
    logout: () => set({user: null})
}))

export default useAuthStore