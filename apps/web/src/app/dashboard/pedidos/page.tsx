import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddPedidoDialog } from "./add-pedido-dialog";


export default async function Home(){

    const pedido = await api.pedidos.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Empalmistas</Title>
          <AddPedidoDialog />
        </div>
        <List>
          {pedido.map((pedido) => {
            return (
              <ListTile
                key={pedido.Id}
                leading={pedido.Id}
                title={pedido.Estado}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}