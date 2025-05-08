import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    TableHeader,
  } from "~/components/ui/table";
  import {
    type ColumnFiltersState,
    type FilterFn,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
  } from "@tanstack/react-table";
  import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
  import {
    
  } from "@tanstack/react-table";
  import { useReactTable, type ColumnDef } from "@tanstack/react-table";
  import { useState } from "react";
  import { Button } from "../ui/button";
import TableToolbar from "./table-toolbar";
import { EmptyState, LoadingState } from "../ui/loading-state";
import { motion } from "framer-motion";
import { DataTablePagination } from "./pagination";
  
  // Dentro del componente
  
  declare module "@tanstack/react-table" {
    //add fuzzy filter to the filterFns
    interface FilterFns {
      fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
      itemRank: RankingInfo;
    }
  }
  
  interface DataTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    desiredColumns?: string[];
    searchPlaceholder?: string;
    popup?: boolean;
    print?: boolean;
    isLoading?: boolean;
    tablePlaceholder?: string;
    sorting?: SortingState;
    noSearch?: boolean;
    onSortingChange?: (updater: ((old: SortingState) => SortingState) | SortingState) => void;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);
  
    // Store the itemRank info
    addMeta({
      itemRank,
    });
  
    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  
  export default function DataTable<TData, TValue>({
    data,
    columns,
    desiredColumns,
    searchPlaceholder,
    popup,
    print,
    isLoading,
    noSearch,
    tablePlaceholder = "No hay resultados.",
  }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnsFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
      data,
      columns,
      initialState: {
        pagination: {
          pageSize: 5,
        },
      },
      state: {
        columnFilters,
        globalFilter,
        sorting,
      },
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnsFilters,
      filterFns: {
        fuzzy: fuzzyFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    });
    const allColumns = Array.from(table.getAllColumns());
    const filteredColumns = desiredColumns
      ? allColumns.filter((column) =>
        desiredColumns.some((dc) => dc === column.id)
      )
      : undefined;
  
   
    return (
      <div className="w-full text-xl ">
       
  
        <div>
          <div className="hide-on-print">
            {noSearch ? null :
              <TableToolbar
                table={table}
                columns={filteredColumns}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                searchPlaceholder={searchPlaceholder || "Buscar..."}
              />
            }
          </div>
          <Table>
            <TableHeader className="print-table">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="print-table-body">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24"
                  >
                    <LoadingState />
                  </TableCell>
                </TableRow>
              ) : !table.getRowModel().rows?.length ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24"
                  >
                    <EmptyState message={tablePlaceholder} />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="odd:bg-muted/100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[10vw] text-ellipsis overflow-hidden whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="hide-on-print">
          <DataTablePagination table={table} popup={popup} />
        </div>
       
      </div >
    );
  }
  