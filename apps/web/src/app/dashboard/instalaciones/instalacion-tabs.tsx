import { useState, useEffect } from 'react';
import { api } from "~/trpc/server";
import { Barcode } from "lucide-react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddInstalacionDialog } from "./add-instalacion-dialog";
import { RouterOutputs } from '~/server/api/root';
import { BarcodeComponent } from '~/components/barcodesvg';

interface InstalacionTabsProps {
    instalaciones: RouterOutputs['instalaciones']['list'] | undefined;
}

const InstalacionTabs: React.FC<InstalacionTabsProps> = ({ instalaciones }) => {
    const [activeTab, setActiveTab] = useState('unfinished');
    const finishedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === 'Completada');
    const unfinishedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === 'Pendiente');
    const inProgressInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === "En progreso");
    const approvedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === "Aprobada");
    const rejectedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === "Rechazada");
    let displayedInstalaciones = [] as RouterOutputs['instalaciones']['list'] | undefined;
    switch (activeTab) {
        case 'unfinished':
            displayedInstalaciones = unfinishedInstalaciones;
            break;
        case 'inprogress':
            // Assuming inProgressInstalaciones is defined similarly
            displayedInstalaciones = inProgressInstalaciones;
            break;
        case 'finished':
            displayedInstalaciones = finishedInstalaciones;
            break;
        case 'approved':
            // Assuming approvedInstalaciones is defined similarly
            displayedInstalaciones = approvedInstalaciones;
            break;
        case 'rejected':
            // Assuming rejectedInstalaciones is defined similarly
            displayedInstalaciones = rejectedInstalaciones;
            break;
        default:
            displayedInstalaciones = [];
    }
    return (
        <>
            <div className="flex space-x-4">
                <button
                    onClick={() => setActiveTab('unfinished')}
                    className={`py-2 px-4 ${activeTab === 'unfinished' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setActiveTab('inprogress')}
                    className={`py-2 px-4 ${activeTab === 'inprogress' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    En curso
                </button>
                
                <button
                    onClick={() => setActiveTab('finished')}
                    className={`py-2 px-4 ${activeTab === 'finished' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Completadas
                </button>
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`py-2 px-4 ${activeTab === 'approved' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Aprobadas
                </button>
                <button
                    onClick={() => setActiveTab('rejected')}
                    className={`py-2 px-4 ${activeTab === 'rejected' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Rechazadas
                </button>
            </div>
            <List>
                {displayedInstalaciones?.map(instalacion => (
                    <ListTile
                        key={instalacion.Id}
                        leading={
                            <BarcodeComponent key={instalacion.Codigo_de_barras} id={instalacion.Codigo_de_barras ?? "placeholder"}/>
                        }
                        title={instalacion.numero}
                        subtitle={instalacion.cliente?.Nombre}
                        
                        href={`/dashboard/instalaciones/${instalacion.Id}`}
                    />
                ))}
            </List>
        </>
    );
};

export default InstalacionTabs;