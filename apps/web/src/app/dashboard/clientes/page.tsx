import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddClienteDialog } from "./add-client-dialog";
import router from "next/router";
import { toast } from "sonner";
import { DeleteClientButton } from "~/components/deletebutton";

export default async function Home(){
    const clients = await api.clientes.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Clientes</Title>
          <AddClienteDialog />
        </div>
        <List>
          {clients.map((clients) => {
            return (
              <ListTile
                key={clients.Id}
                leading={clients.Direccion}
                title={clients.Nombre}
                button={<AddClienteDialog client={clients} />}
                deleteButton={<DeleteClientButton clientId={clients.Id} />}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}