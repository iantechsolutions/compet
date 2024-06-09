
import '~/styles/globals.css'
import { Inter } from 'next/font/google'
import Sidebar from '~/components/sidebar'
import AuthProviderSSR from '~/components/auth-provider/auth-provider-ssr'
import { TRPCReactProvider } from '~/trpc/react'
import Header from '~/components/header'
import { SidenavItem } from '~/components/sidenav'
import Sidenav from '~/components/sidenav'
import {
    DrillIcon,
    LayoutDashboardIcon,
    PackageIcon,
    Settings2Icon,
    TruckIcon,
    UserRound,
    UsersRoundIcon,
  } from "lucide-react";
// import { useUserInfo } from '../components/auth-provider/auth-provider-client'
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata = {
    title: 'tRacc',
    description: '',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const userInfo = useUserInfo()
    return (
        <html lang='es'>
            <body className={`font-sans ${inter.variable}`}>
                <AuthProviderSSR>
                    <TRPCReactProvider>
                        <Header title=
                        // {<img src='https://utfs.io/f/c58b7189-5fb3-4b5b-b1c6-2f1adec6c663-hcebrm.png' className='p-r-4 py-6 p-y-6 m-5' width={200}  alt='logo' />}
                        {<img src='https://utfs.io/f/7d166dbd-2612-4e52-868f-195c79c458b9-ew43jv.png' className='p-r-4' alt='logo' width={160} />}
                        >
                            <div className='pl-64 pt-11'>
                                {children}
                            </div>
                        </Header>
                        <div className='fixed top-16 bottom-0 left-0 flex flex-col gap-2 p-2 pr-6 shadow-xl sm:flex h-full'>
                            <Sidebar/>
                        </div>
                    </TRPCReactProvider>
                </AuthProviderSSR>
            </body>
        </html>
    )
}