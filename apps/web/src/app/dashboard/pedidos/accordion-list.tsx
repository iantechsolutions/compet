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
    estado: string;
    productos: {
    Id: number;
    Nombre: string;
    Descripcion: string;
    Cantidad: number;
    }[];
  }
interface AccordionListProps {
    pedidos: {
        id: number;
        clienteId: string;
        Fecha_de_creacion: Date;
        Fecha_de_aprobacion: Date | null;
        Fecha_de_envio: Date | null;
        estado:  "Pendiente" | "Aprobado" | "Enviado" | "Generado";
        cliente: {
            Id: string;
            Nombre: string | null;
            Direccion: string | null;
        };
        productos: {
            Id: string;
            Nombre: string | null;
            Pedido: number;
            Producto: string;
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


    const handleEditestado = (id: number, estado: string) => {
        const pedido = pedidos.find((pedido) => pedido.id === id);
        if (pedido?.estado === "Pendiente") {
            pedido.estado = "Aprobado";
            pedido.Fecha_de_aprobacion = new Date();
            updatePedido({
                id: id,
                clienteId: pedido.clienteId,
                estado: pedido.estado,
                fechaCreacion: pedido.Fecha_de_creacion.getTime(),
                fechaAprobacion: pedido.Fecha_de_aprobacion.getTime(),
            });
        }
        else if(pedido?.estado === "Aprobado"){
            pedido.estado = "Enviado";
            pedido.Fecha_de_envio = new Date();
            updatePedido({
                id: id,
                clienteId: pedido.clienteId,
                estado: pedido.estado,
                fechaCreacion: pedido.Fecha_de_creacion.getTime(),
                fechaAprobacion: pedido.Fecha_de_aprobacion?.getTime(),
                fechaEnvio: pedido.Fecha_de_envio?.getTime(),
            });
            createInstalacion({
                cliente: pedido.clienteId,
                fechaAlta: new Date().getMilliseconds(),
                pedido : Number(pedido.id),
                estado: "Pendiente",
                empalmista: "",
                tipoInstalacionId:0,
                productoPedidoId: "",
                codigoDeBarras: "",
                nroLoteArticulo: "",
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
                    <div className="flex flex-row gap-4"><h5 className=" font-bold">clienteId: </h5><h5>{pedido.cliente.Nombre}</h5></div>
                    <div className="flex flex-row gap-4"><h5 className=" font-bold">estado: </h5><h5>{pedido.estado}</h5></div>
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
            {pedido?.estado !== "Enviado" && (
                <Button onClick={() => {handleEditestado(pedido.id, pedido.estado)}}>
                    <span>
                        {pedido.estado === "Pendiente" ? "Aprobar pedido" : "Enviar pedido"}
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