import { Button } from "../ui/button";
import { Column, Table } from "@tanstack/react-table";
import { RefreshCcwIcon } from "lucide-react";

import Filters from "./filters";
import SearchInput from "./searchInput";
import { useRef } from "react";

interface TableToolbarProps<TData, Tvalue> {
  table: Table<TData>;
  columns?: Column<TData, Tvalue>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  searchPlaceholder: string;
}

interface FiltersRef {
  clearFilters: () => void;
}
// Componente principal TableToolbar
export default function TableToolbar<TData, Tvalue>({
  searchPlaceholder,
  columns,
  table,
  globalFilter,
  setGlobalFilter,
}: TableToolbarProps<TData, Tvalue>) {
  const filtersRef = useRef<FiltersRef>(null);

  const handleClearFilters = () => {
    // Primero limpiamos los filtros de la tabla
    table.resetColumnFilters();
    table.resetGlobalFilter();
    setGlobalFilter(""); // Importante: limpiar también el globalFilter

    // Después limpiamos los filtros del componente
    if (filtersRef.current) {
      filtersRef.current.clearFilters();
    }
  };

  const ButtonRefresh = (
    <Button variant="transparent" size="icon" onClick={handleClearFilters}>
      <RefreshCcwIcon className="w-4 h-4 text-muted-foreground" />
    </Button>
  );
  return (
    <div className="flex justify-between items-center w-full py-5">
      <div className="flex gap-1 w-full">
        <SearchInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder={searchPlaceholder ?? "Buscar..."}
        />
        {table.getState().globalFilter && (
          ButtonRefresh
        )}
      </div>
      <div className="flex gap-2 px-1 items-center">
        {columns && columns.length > 0 && (
          <Filters
            ref={filtersRef}
            table={table}
            columns={columns}
            onClearFilters={handleClearFilters}
            isLoading={false}
          />
        )}
        {table.getState().columnFilters.length > 0 && ButtonRefresh}
      </div>
    </div>
  );
}
