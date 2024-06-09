"use client"
import { api } from "~/trpc/react";
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { AddInstalacionDialog } from "./add-instalacion-dialog";
import instalacionTabs from './instalacion-tabs';

export default function Home() {
  // const instalaciones = await api.instalaciones.list();
  const { data: instalaciones} = api.instalaciones.list.useQuery(undefined);
  return (
    <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Instalaciones</Title>
          <AddInstalacionDialog />
        </div>
        {instalacionTabs({instalaciones})}
      </section>
    </LayoutContainer>
  );
}
