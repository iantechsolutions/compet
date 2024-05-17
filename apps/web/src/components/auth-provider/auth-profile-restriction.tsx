'use client'

import { useUserInfo } from './auth-provider-client'

export default function AuthProfileRestriction(props: { children: React.ReactNode; requireSeller?: boolean; requireBuyer?: boolean }) {
    const userInfo = useUserInfo()

    if (props.requireBuyer && !userInfo?.isClient) {
        return <NoBuyerPage />
    }

    if (props.requireSeller && !userInfo?.isCompany) {
        return <NoSellerPage />
    }

    return <>{props.children}</>
}

export function NoBuyerPage() {
    return <div>Buyer required</div>
}

export function NoSellerPage() {
    return <div>Seller required</div>
}
