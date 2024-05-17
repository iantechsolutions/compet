import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddInstalacionDialog } from "./add-instalacion-dialog";
  

export default async function Home(){
    const instalaciones = await api.instalaciones.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Instalaciones</Title>
          <AddInstalacionDialog />
        </div>
        <List>
          {instalaciones.map((instalacion) => {
            return (
              <ListTile
                key={instalacion.Id}
                leading={instalacion.empalmista?.Nombre}
                title={instalacion.cliente?.Nombre}
                href={`/dashboard/instalaciones/${instalacion.Id}`}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}