import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddProductoDialog } from "./add-product-dialog";
import { DeleteProductoButton } from "~/components/deletebuttonproducto";

export default async function Home(){
    const products = await api.productos.list();
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Productos</Title>
          <AddProductoDialog />
        </div>
        <List>
          {products.map((product) => {
            return (
              <ListTile
                key={product.id}
                title={product.nombre}
                leading={product.descripcion}
                button={<AddProductoDialog product={product} />}
                deleteButton={<DeleteProductoButton productoId={product.id} />}
              />
            );
          })}
        </List>
      </section>
    </LayoutContainer>
    )
}