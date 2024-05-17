import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddEmpalmistaDialog } from "./add-empalmista-dialog";

export default async function Home(){
    const clients = await api.empalmistas.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Empalmistas</Title>
          <AddEmpalmistaDialog />
        </div>
        <List>
          {clients.map((clients) => {
            return (
              <ListTile
                key={clients.Id}
                leading={clients.Id}
                title={clients.Nombre}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}