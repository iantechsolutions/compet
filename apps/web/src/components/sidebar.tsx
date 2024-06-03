'use client'

import { useState } from 'react'
import { useUserInfo } from './auth-provider/auth-provider-client'
import { Button } from './ui/button'
import {
    BarcodeIcon,
    DrillIcon,
    LayoutDashboardIcon,
    ListChecks,
    ListChecksIcon,
    PackageIcon,
    Settings2Icon,
    TagIcon,
    TruckIcon,
    UserRound,
    UsersRoundIcon,
  } from "lucide-react";
import Link from 'next/link';
import { SidenavItem } from '~/components/sidenav';
import Sidenav from '~/components/sidenav';
export default function Sidebar() {
    const userInfo = useUserInfo()

    const [expanded, setExpanded] = useState(false)

    function toggleExpanded() {
        setExpanded((prev) => !prev)
    }

    return (
        <Sidenav>
                                <SidenavItem icon={<Settings2Icon />} href="/dashboard">
                                    Inicio
                                </SidenavItem>
                                {userInfo?.isCompany && (

                                    <SidenavItem
                                    icon={<UserRound />}
                                    href="/dashboard/clientes"
                                    >
                                    Clientes
                                </SidenavItem>
                                )} 
                                <SidenavItem
                                    icon={<UsersRoundIcon />}
                                    href="/dashboard/empalmistas"
                                >
                                    Empalmistas
                                </SidenavItem>
                                {userInfo?.isCompany && (
                                <SidenavItem
                                    icon={<PackageIcon />}
                                    href="/dashboard/productos"
                                >
                                    Productos
                                </SidenavItem>
                                )}
                                {userInfo?.isCompany && (
                                <SidenavItem
                                    icon={<TagIcon />}
                                    href="/dashboard/tiposinstalaciones"
                                >
                                    Categorias
                                </SidenavItem>
                                )}
                                {userInfo?.isCompany && (
                                <SidenavItem
                                    icon={<TruckIcon />}
                                    href="/dashboard/pedidos"
                                >
                                    Pedidos
                                </SidenavItem>
                                )}

                                <SidenavItem
                                    icon={<DrillIcon />}
                                    href="/dashboard/instalaciones"
                                >
                                    Instalaciones
                                </SidenavItem>
                                <SidenavItem
                                    icon={<ListChecksIcon/>}
                                    href="/dashboard/pasoscriticos"
                                >
                                    Pasos Criticos
                                </SidenavItem>
                                <SidenavItem
                                    icon={<BarcodeIcon />}
                                    href="/dashboard/barcode"
                                >
                                    Barcode
                                </SidenavItem>
                            </Sidenav>
    )
}