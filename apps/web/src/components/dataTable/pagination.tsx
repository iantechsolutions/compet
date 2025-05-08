  import { cn } from "~/lib/utils";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select";
import { Table } from "@tanstack/react-table";
  import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
  import { useEffect, useState } from "react";
import { Button } from "../ui/button";
      
  interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    containerClassName?: string;
    popup?: boolean;
    // rightIcon?: React.ReactNode;
  }
  
  export function DataTablePagination<TData>({
    table,
    containerClassName,
    popup,
  }: DataTablePaginationProps<TData>) {
    const [pages, setPages] = useState<(number | string)[]>([]);
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getRowCount();
    const totalPages = Math.ceil(totalRows / pageSize);
    useEffect(() => {
      const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxButtons = 5;
  
        const half = Math.floor(maxButtons / 2);
        const currentIndex = pageIndex + 1;
        let start = Math.max(1, currentIndex - half);
        let end = Math.min(totalPages, currentIndex + half);
  
        if (currentIndex <= half) {
          end = Math.min(maxButtons, totalPages);
        } else if (currentIndex + half >= totalPages) {
          start = Math.max(1, totalPages - maxButtons + 1);
        }
  
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
  
        if (start > 1) {
          pages.unshift(1);
          if (start > 2) {
            pages.splice(1, 0, "...");
          }
        }
  
        if (end < totalPages) {
          pages.push(totalPages);
          if (end < totalPages - 1) {
            pages.splice(pages.length - 1, 0, "...");
          }
        }
  
        return pages;
      };
      setPages(getPageNumbers());
    }, [pageIndex, totalPages]);
    const firstRowShown = pageIndex * pageSize + 1;
    const lastRowShown = Math.min(
      (pageIndex + 1) * pageSize,
      table.getFilteredRowModel().rows.length
    );
    const goToPage = (pageNumber: number) => {
      table.setPageIndex(pageNumber);
    };
    useEffect(() => {
      if (popup) {
        table.setPageSize(5);
      }
    }, [popup, table]);
    return (
      <div
        className={cn(
          "flex items-center justify-between px-2 mt-2 w-full",
          containerClassName
        )}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground ">Mostrar</p>
          <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
  <SelectTrigger
    className="h-4 w-[70px] rounded-full text-muted-foreground border-2 border-secondary/70"
  >
    <SelectValue placeholder={table.getState().pagination.pageSize} className=" text-muted-foreground" />
  </SelectTrigger>
  <SelectContent side="top" className="bg-white text-muted-foreground rounded-md shadow-lg">
    {popup ? (
      <SelectItem
        key={5}
        value="5"
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md bg-transparent px-5 py-5 text-sm ring-offset-background"
      >
        5
      </SelectItem>
    ) : (
      [5, 10, 20, 30, 40, 50].map((pageSize) => (
        <SelectItem
          key={pageSize}
          value={`${pageSize}`}
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md bg-transparent px-5 py-5 text-sm ring-offset-background"
        >
          {pageSize}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>
        </div>
        <div className="ml-2 flex-1 text-sm text-muted-foreground hidden sm:block">
          Mostrando 
          {/* <span className="font-bold"> {firstRowShown}</span> a{" "} */}
          <span className="font-bold"> {lastRowShown}</span> de{" "}
          <span className="font-bold">{totalRows} </span> entradas
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="text-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previo
          </Button>
          {pages.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                className={`px-3 h-5 w-auto text-[0.6rem] text-black rounded-full text-muted-foreground items-center flex justify-center ${
                  pageIndex === page - 1 ? "bg-secondary/70" : "bg-gray-200"
                }`}
                onClick={() => goToPage(page - 1)}
              >
                {page}
              </button>
            ) : (
              <span
                key={index}
                className="px-3 h-5 w-auto text-[0.6rem] rounded-md text-muted-foreground"
              >
                {page}
              </span>
            )
          )}
  
          <Button
            variant="default"
            className="text-white"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }
  