import { memo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils"
import { Calendar } from "~/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";

// Definición genérica del componente DatePicker
function DatePickerRange({
  value,
  onValueChange,
  className,
  placeholder,
}: {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] bg-white hover:bg-white/80 justify-start text-black text-left font-normal text-ellipsis overflow-hidden",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {dayjs(value.from).format("D/M")} -{" "}
                {dayjs(value.to).format("D/M")}
              </>
            ) : (
              dayjs(value.from).format("D/M")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onValueChange}
          locale={es}
          defaultMonth={value?.from}
        />
      </PopoverContent>
    </Popover>
  );
}

// Memoización del componente con aserción de tipo para mantener la genérica
const MemoizedDatePickerRange = memo(DatePickerRange) as (props: {
  value: DateRange | undefined;
  onValueChange: (value: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}) => ReturnType<typeof DatePickerRange>;

export default MemoizedDatePickerRange;
