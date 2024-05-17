"use client"
import { api } from "~/trpc/react"
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
    import { Button } from "~/components/ui/button"; // Assuming you have a Button component

interface Pedido {
    Fecha_de_creacion: string;
    cliente: {
      Nombre: string;
    };
    Estado: string;
    productos: {
      Id: string;
      Nombre: string;
      Descripcion: string;
      Cantidad: number;
    }[];
  }
interface AccordionListProps {
    pedidos: {
        Id: number;
        Cliente: number;
        Fecha_de_creacion: Date;
        Fecha_de_aprobacion: Date | null;
        Fecha_de_envio: Date | null;
        Estado: string;
        cliente: {
            Id: number;
            Nombre: string | null;
            Direccion: string | null;
        };
        productos: {
            Id: number;
            Nombre: string | null;
            Pedido: number;
            Producto: number;
            Codigo_de_barras: string | null;
            Descripcion: string | null;
            Cantidad: number;
        }[] | undefined;
    }[]; // Replace any with the actual type of your pedidos
    }

export default function AccordionList({ pedidos }: AccordionListProps) {

    const { mutateAsync: updatePedido } =
    api.pedidos.update.useMutation();
      
    const { mutateAsync: createInstalacion } =
    api.instalaciones.create.useMutation();


    const handleEditEstado = (id: number, estado: string) => {
        const pedido = pedidos.find((pedido) => pedido.Id === id);
        if (pedido?.Estado === "Pendiente") {
            pedido.Estado = "Aprobado";
            pedido.Fecha_de_aprobacion = new Date();
            updatePedido({
                Id: id,
                Cliente: pedido.Cliente,
                Estado: pedido.Estado,
                FechaCreacion: pedido.Fecha_de_creacion.getTime(),
                Fecha_de_aprobacion: pedido.Fecha_de_aprobacion.getTime(),
            });
        }
        else if(pedido?.Estado === "Aprobado"){
            pedido.Estado = "Enviado";
            pedido.Fecha_de_envio = new Date();
            updatePedido({
                Id: id,
                Cliente: pedido.Cliente,
                Estado: pedido.Estado,
                FechaCreacion: pedido.Fecha_de_creacion.getTime(),
                Fecha_de_aprobacion: pedido.Fecha_de_aprobacion?.getTime(),
                Fecha_de_envio: pedido.Fecha_de_envio?.getTime(),
            });
            createInstalacion({
                Cliente: pedido.Cliente,
                FechaAlta: new Date().getMilliseconds(),
                Pedido : pedido.Id,
                Estado: 0,
                Empalmista: 1,
            })
        
        }
    }
    return(
    <Accordion type="single" collapsible>
        {pedidos.map((pedido, index) => {
            const date = new Date(pedido.Fecha_de_creacion);
            const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
            return (
            <AccordionItem value={`item-${index}`}>
            <AccordionTrigger>{"Pedido de: " + pedido.cliente.Nombre + " del " + formattedDate}</AccordionTrigger>
            <AccordionContent>
                {<div className="px-8 pt-4">
                <div className="row flex flex-row justify-between">
                    <div className="flex flex-row gap-4"><h5 className=" font-bold">Cliente: </h5><h5>{pedido.cliente.Nombre}</h5></div>
                    <div className="flex flex-row gap-4"><h5 className=" font-bold">Estado: </h5><h5>{pedido.Estado}</h5></div>
                </div>
                <div>
                  <br/>
                    <h2 className="pb-3 font-bold">Productos</h2>
                    <hr/>
                    <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead>Nombre del producto</TableHead>
                          <TableHead>Descripcion</TableHead>
                          <TableHead>Cantidad</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {pedido.productos?.map((producto) => (
                              <TableRow key={producto.Id}>
                                  <TableCell>{producto.Nombre}</TableCell>
                                  <TableCell>{producto.Descripcion}</TableCell>
                                  <TableCell>{producto.Cantidad}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                </div>
                <br/>
            {pedido?.Estado !== "Enviado" && (
                <Button onClick={() => {handleEditEstado(pedido.Id, pedido.Estado)}}>
                    <span>
                        {pedido.Estado === "Pendiente" ? "Aprobar pedido" : "Enviar pedido"}
                    </span>
                </Button>
                // <AdvanceButton pedido={pedido} pedidos={pedidos}></AdvanceButton>
            )
            }

                </div>}
            </AccordionContent>
            </AccordionItem>
        )})}
        </Accordion>
        )
}