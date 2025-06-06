import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import InfoButton from "~/components/ui/info-button";

export type PedidoTabla = {
  id: number;
  estado: "Pendiente"| "Generado"| "Enviado"| "Aprobado" | "ACTIVO";
  numero: string;
  cliente: string;
  fecha_creacion: string;
};

const columnHelper = createColumnHelper<PedidoTabla>();

export const createPedidoColumns = (refetch: () => void) =>
  [
    columnHelper.accessor("numero", {
      id: "numero",
      header: () => "Número",
      enableGlobalFilter: true,
    }),
    columnHelper.accessor("cliente", {
      id: "cliente",
      header: () => "Cliente",
      enableGlobalFilter: true,
    }),
    columnHelper.accessor("fecha_creacion", {
      id: "fecha_creacion",
      header: () => "Fecha de creación",
      enableGlobalFilter: false,
    }),
    columnHelper.accessor("estado", {
      id: "estado",
      header: () => "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado;
        return (
          <span
            className={`mr-2 w-full p-1 px-3 text-center text-xs rounded-full ${
              estado === "ACTIVO"
                ? "bg-secondary font-medium text-primary-foreground"
                : "bg-accent/60"
            }`}
          >
            {estado}
          </span>
        );
      },
      enableGlobalFilter: false,
    }),
    // columnHelper.display({
    //   id: "acciones",
    //   header: () => "Acciones",
    //   cell: ({ row }) => {
    //     const id = row.original.Id;
    //     return (
    //       <div className="flex items-center place-items-center">
    //         <InfoButton href={`/pedidos/${id}`} />
    //       </div>
    //     );
    //   },
    // }),
  ] as ColumnDef<PedidoTabla, unknown>[];
