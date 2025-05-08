"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  type ReactElement,
  type ForwardedRef,
} from "react";
import { Button } from "../ui/button";
import type { Column, Table } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { Loader2, ChevronRight, SlidersHorizontal } from "lucide-react";
import DatePickerRange from "./date-picker-range";
import type { DateRange } from "react-day-picker";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem, } from "../ui/select";
// Definimos el tipo para las props del componente
interface FiltersProps<TData, TValue> {
  table: Table<TData>;
  columns?: Column<TData, TValue>[];
  onClearFilters: () => void; // Prop para manejar la limpieza de filtros desde fuera
  isLoading?: boolean; // Nueva prop
}

// Este es el tipo de los métodos que queremos exponer a través del ref
interface FiltersRef {
  clearFilters: () => void;
}

interface SelectedValues {
  [key: string]: string | DateRange | undefined;
}

const Filters = forwardRef(function Filters<TData, TValue>(
  { table, columns, onClearFilters, isLoading }: FiltersProps<TData, TValue>,
  ref: ForwardedRef<FiltersRef>
) {
  const [showFilters, setShowFilters] = useState(false);
  const form = useForm();
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({});

  useImperativeHandle(ref, () => ({
    clearFilters: () => {
      setSelectedValues({});
      form.reset();
      for (const column of columns || []) {
        const columnTable = table.getColumn(column.id);
        if (columnTable) {
          columnTable.setFilterValue(undefined);
        }
      }
      form.trigger();
    },
  }));

  // Manejar el cierre/apertura del filtro
  const handleToggleFilters = () => {
    if (showFilters) {
      // Si estamos cerrando, limpiamos todo
      setSelectedValues({});
      form.reset();
      onClearFilters();
    }
    setShowFilters(!showFilters);
  };

  const onSubmit = () => {
    const data = form.getValues();
    for (const [columnName, value] of Object.entries(data)) {
      const column = table.getColumn(columnName);
      if (column) {
        if (value?.from && value?.to) {
          column.setFilterValue({
            from: value.from,
            to: dayjs(value.to).endOf('day').toDate(),
          });
        }
      }
    }
  };

  function getSelectOptions(column: Column<TData, TValue>) {
    if (isArray(column)) {
      const values = Array.from(column.getFacetedUniqueValues().keys());
      const options = new Set(values.flatMap(arr => arr as string[]));
      
      return Array.from(options).map(item => {
        if (item === "") {
          console.error('item acá está mal');
          item = "Sin nombre";
        }

        return <SelectItem key={item} value={item}>
          {item}
        </SelectItem>;
      });
    }

    return Array.from(column.getFacetedUniqueValues().keys()).map(item => {
      if (item === "") {
        console.error('item acá está mal');
        item = "Sin nombre";
      }

      return <SelectItem key={item} value={item}>
        {item}
      </SelectItem>;
    });
  }

  const onFilterChange = (columnId: string, value: string) => {
    const columnTable = table.getColumn(columnId);
    columnTable?.setFilterValue(value);
  };

  return (
    <div className="flex items-center bg-primary-foreground rounded-full">
      <Button
        variant={"default"}
        size="sm"
        onClick={handleToggleFilters}
      >
        {showFilters ? (<ChevronRight className="h-3.5 w-3.5" />) : (<><SlidersHorizontal className="h-5 w-auto" />Filtros</>)}

        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      </Button>
      <div
        className={`transition-all duration-1000  overflow-hidden ${showFilters
          ? "opacity-100 max-h-[500px]"
          : "opacity-0 max-h-0 max-w-[0px]"
          }`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-3 items-center">
              {columns?.map((column) => {
                if (isDate(column)) {
                  return (
                    <DatePickerRange
                      key={column.id}
                      placeholder={snakeToTitleCase(column.id)}
                      value={selectedValues[column.id] as DateRange | undefined}
                      onValueChange={(value) => {
                        const adjustedValue = value?.to
                          ? {
                              ...value,
                              to: dayjs(value.to).endOf("day").toDate(),
                            }
                          : value;
                  
                        setSelectedValues((prev) => ({
                          ...prev,
                          [column.id]: adjustedValue,
                        }));
                  
                        column.setFilterValue(adjustedValue);
                      }}
                      className="bg-transparent hover:bg-transparent w-fit px-2 shadow-none transition-all duration-1000 "
                    />
                  );                  
                }
                return (
                  <FormField
                    key={column.id}
                    control={form.control}
                    name={column.id}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={selectedValues[column.id] as string | undefined || ""}
                          onValueChange={(value: string) => {
                            setSelectedValues(prev => ({
                              ...prev,
                              [column.id]: value
                            }));
                            onFilterChange(column.id, value);
                            field.onChange(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="border-none truncate text-ellipsis overflow-hidden ring-offset-0 focus:ring-0 focus:[outline:none] focus:[outline-offset:0] shadow-none min-w-[90px]">
                              <SelectValue placeholder={snakeToTitleCase(column.id)} className="capitalize" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getSelectOptions(column)}
                          </SelectContent>
                        </Select>

                        {/* <SelectSearch
                          placeholder="Buscar..."
                          items={
                            getSelectOptions(column).map((item) => ({
                              value: item.key,
                              label: item.props.children,
                            }))
                          }
                          multiple={false}
                          value={[selectedValues[column.id] as string | undefined || ""]}
                          onValueChange={(value) => {
                            setSelectedValues(prev => ({
                              ...prev,
                              [column.id]: value
                            }));
                            onFilterChange(column.id, value);
                            field.onChange(value);
                          }}
                        /> */}
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}) as <TData, TValue>(
  props: FiltersProps<TData, TValue> & { ref?: ForwardedRef<FiltersRef> }
) => ReactElement;

export default Filters;

function isDate<TData, TValue>(column: Column<TData, TValue>) {

  // Obtener algunos valores de muestra
  const values = Array.from(column.getFacetedUniqueValues().keys());

  // Si no hay valores, no es una columna de fecha
  if (!values.length) return false;

  // Verificar el primer valor no nulo
  const sampleValue = values.find(value => value != null);
  return sampleValue ? dayjs(sampleValue).isValid() : false;
}

function isArray<TData, TValue>(column: Column<TData, TValue>) {
  const values = Array.from(column.getFacetedUniqueValues().keys());
  const sampleValue = values.find(value => value != null);
  return Array.isArray(sampleValue);
}


const corrections: Record<string, string> = {
  finalizacion: 'finalización',
  planificacion: 'planificación',
  terminado: 'terminada',
  // Agregá más parejas acá a medida que surjan
};

export const snakeToTitleCase = (str: string): string => {
  const words = str.split('_').map(word => word.toLowerCase());

  const correctedWords = words.map(word => corrections[word] || word);

  // Capitalizar solo la primera palabra
  if (correctedWords.length > 0) {
    correctedWords[0] = (correctedWords[0] ?? "").charAt(0).toUpperCase() + (correctedWords[0] ?? "").slice(1);
  }

  return correctedWords.join(' ');
};
