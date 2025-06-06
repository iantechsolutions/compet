"use client"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { AddPedidoDialog } from "./add-pedido-dialog";
import dayjs from "dayjs";
import DataTable from "~/components/dataTable/dataTable";
import { api } from "~/trpc/react";
import { Pedido } from "~/server/api/routers/pedidos";
import { createPedidoColumns, PedidoTabla } from "./columns";


export default function Home(){

    const {data: pedidos, refetch} = api.pedidos.list.useQuery();


    const data: PedidoTabla[]  = (pedidos ?? []).map((ped: Pedido) => ({
      id: ped?.id || 0,
      estado: ped?.estado || "Pendiente",
      numero: String(ped?.numero) || "Sin número",
      fecha_creacion: ped?.fechaCreacion
        ? dayjs(ped?.fechaCreacion).format("DD/MM/YYYY")
        : "Sin Fecha",
        cliente: ped?.cliente.nombre || "Sin Cliente",
    }));






    return(
      <LayoutContainer>
        <div className="flex justify-between">
          <Title>Pedidos</Title>
          <AddPedidoDialog refetch={refetch}/>
        </div>
        <List>
        <DataTable
        data={data ?? []}
        columns={createPedidoColumns(refetch)}
        searchPlaceholder={"Buscar por número de pedido"}
      />
        </List>
    </LayoutContainer>
    )
}