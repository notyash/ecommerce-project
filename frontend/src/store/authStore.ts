import { create } from 'zustand'
import { User } from '../types/user'

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