import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddPasoDialog } from "./add-paso-dialog";
import { DeletePasoButton } from "~/components/deletebuttonpaso";
  

export default async function Home(){
    const criticsteps = await api.pasoCritico.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Pasos Criticos</Title>
          <AddPasoDialog />
        </div>
        <List>
          {criticsteps.map((Paso) => {
            return (
              <ListTile
                key={Paso.id}
                leading={Paso.description}
                button={<AddPasoDialog paso={Paso} />}
                deleteButton={<DeletePasoButton clientId={Paso.id} />}
                // href={`/dashboard/criticsteps/${Paso.id}`}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}