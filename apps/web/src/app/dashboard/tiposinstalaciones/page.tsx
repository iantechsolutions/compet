import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddTipoInstalacionDialog } from "./add-tipo-dialog";
import './page.css'
import { DeleteTipoInstalacionButton } from "~/components/deletebuttontipoinstalacion";
  

export default async function Home(){
    const criticsteps = await api.tipoInstalaciones.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Categorias de productos</Title>
          <AddTipoInstalacionDialog  />
        </div>
        <List>
          {criticsteps.map((Paso) => {
            return (
              <ListTile
                key={Paso.id}
                leading={Paso.description}
                // href={`/dashboard/tiposinstalaciones/${Paso.id}`}
                button={<AddTipoInstalacionDialog tipoInstalacion={Paso} />}
                deleteButton={<DeleteTipoInstalacionButton clientId={Paso.id} />}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}