import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  extraKeys?: Array<{ title?: string; objectDate: string; render?: () => React.ReactNode }>;
  titleTooltip?: string
}

export function CustomTooltip({ payload, label, active, extraKeys, titleTooltip }: CustomTooltipProps) {
  const { getNestedValue } = UseUtilHooks();

  if (active && payload && payload.length) {
    const uniquePayload = payload[0];
    const rawData = uniquePayload.payload;

    return (
      <div className={`${extraKeys?.length > 0 ? "w-[500px]" : "w-fit"} p-4 border border-gray-200 rounded-lg bg-white shadow-xl overflow-auto`}>
        <h5 className="text-sm font-bold mb-2">
          {titleTooltip ? titleTooltip : label}
        </h5>
        {extraKeys && extraKeys.length > 0 && (
          <div className="mt-1 border-t border-gray-200 flex flex-col gap-y-2">
            {extraKeys.map((key) => {
              const value = getNestedValue(rawData, key.objectDate);
              if (value !== undefined) {
                return (
                  <div key={key.objectDate} className="mt-2 text-black w-full bg-background p-2 border border-gray-200 rounded-md flex flex-col">
                    {key.title && key.title !== "" ? <strong className="text-xs">{key.title}</strong> : key.render && key.render()}
                    <span className="text-sm">{String(value)}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  }
  return null;
}
