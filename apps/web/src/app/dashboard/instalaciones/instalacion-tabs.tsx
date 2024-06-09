import { useState, useEffect } from 'react';
import { api } from "~/trpc/server";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddInstalacionDialog } from "./add-instalacion-dialog";
import { RouterOutputs } from '~/server/api/root';

interface InstalacionTabsProps {
    instalaciones: RouterOutputs['instalaciones']['list'] | undefined;
}

const InstalacionTabs: React.FC<InstalacionTabsProps> = ({ instalaciones }) => {
    const [activeTab, setActiveTab] = useState('unfinished');
    const finishedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado === 'Aprobada' || instalacion.Estado === 'Rechazada');
    const unfinishedInstalaciones = instalaciones?.filter(instalacion => instalacion.Estado !== "Aprobada" && instalacion.Estado !== "Rechazada");

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
                    onClick={() => setActiveTab('finished')}
                    className={`py-2 px-4 ${activeTab === 'finished' ? 'border-b-2 border-blue-500' : ''}`}
                >
                    Terminadas
                </button>
            </div>
            <List>
                {(activeTab === 'unfinished' ? unfinishedInstalaciones : finishedInstalaciones)?.map(instalacion => (
                    <ListTile
                        key={instalacion.Id}
                        leading={instalacion.empalmista?.Nombre}
                        title={instalacion.cliente?.Nombre}
                        href={`/dashboard/instalaciones/${instalacion.Id}`}
                    />
                ))}
            </List>
        </>
    );
};

export default InstalacionTabs;