'use client'

import { createContext, useContext } from 'react'
import type { RouterOutputs } from '~/server/api/root'

const userContext = createContext<RouterOutputs['users']['current'] | null>(null)

export function AuthProvider(props: { userInfo: RouterOutputs['users']['current']; children: React.ReactNode }) {
    return <userContext.Provider value={props.userInfo}>{props.children}</userContext.Provider>
}

export function useUserInfo() {
    const context = useContext(userContext)

    if (!context) {
        throw new Error('useSession must be used within a AuthProvider')
    }

    return context
}
