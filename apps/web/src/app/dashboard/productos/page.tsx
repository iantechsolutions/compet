import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddProductoDialog } from "./add-product-dialog";
import { DeleteProductoButton } from "~/components/deletebuttonproducto";

export default async function Home(){
    const clients = await api.productos.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Productos</Title>
          <AddProductoDialog />
        </div>
        <List>
          {clients.map((clients) => {
            return (
              <ListTile
                key={clients.Id}
                title={clients.Nombre}
                leading={clients.Descripcion}
                button={<AddProductoDialog product={clients} />}
                deleteButton={<DeleteProductoButton productoId={clients.Id} />}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}