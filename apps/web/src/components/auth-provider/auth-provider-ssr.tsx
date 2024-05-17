import { api } from '~/trpc/server'
import { AuthProvider } from './auth-provider-client'

export default async function AuthProviderSSR(props: { children: React.ReactNode }) {
    const userInfo = await api.users.current()

    return <AuthProvider userInfo={userInfo}>{props.children}</AuthProvider>
}
