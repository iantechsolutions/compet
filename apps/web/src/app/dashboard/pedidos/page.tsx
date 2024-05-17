import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "~/components/ui/accordion"
import { AddPedidoDialog } from "./add-pedido-dialog";
import AccordionList from "./accordion-list";

  export default async function Home(){
    const pedidos = await api.pedidos.list();
    const c = pedidos.at(0)?.productos;
    return(
      <LayoutContainer>
      <section className="space-y-2">
        <div className="flex justify-between">
          <Title>Pedidos</Title>
          <AddPedidoDialog />
        </div>
        <AccordionList pedidos={pedidos}></AccordionList>
        
        <br/>
        <br/>
        <br/>
        <br/>
      </section>
    </LayoutContainer>
    )
}