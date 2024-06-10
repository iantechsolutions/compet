import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddEmpalmistaDialog } from "./add-empalmista-dialog";
import { DeleteEmpalmistaButton } from "~/components/deletebuttonempalmista";

export default async function Home(){

    const empalmistas = await api.empalmistas.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Empalmistas</Title>
          <AddEmpalmistaDialog />
        </div>
        <List>
          {empalmistas.map((empalmistas) => {
            return (
              <ListTile
                key={empalmistas.Id}
                title={empalmistas.Nombre}
                button={<AddEmpalmistaDialog empalmista={empalmistas} />}
                deleteButton={<DeleteEmpalmistaButton clientId={empalmistas.Id} />}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}