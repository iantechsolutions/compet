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
      Id: ped?.Id || "Sin Id",
      estado: ped?.Estado || "SinEstado",
      numero: String(ped?.Numero) || "Sin número",
      fecha_creacion: ped?.Fecha_de_creacion
        ? dayjs(ped?.Fecha_de_creacion).format("DD/MM/YYYY")
        : "Sin Fecha",
        cliente: ped?.clientes.Nombre || "Sin Cliente",
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