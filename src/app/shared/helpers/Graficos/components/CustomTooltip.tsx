import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  extraKeys?: Array<{ title?: string; objectDate: string; render?: () => React.ReactNode }>;
}

export function CustomTooltip({ payload, label, active, extraKeys }: CustomTooltipProps) {
  const { getNestedValue } = UseUtilHooks();

  if (active && payload && payload.length) {
    const uniquePayload = payload[0];
    const rawData = uniquePayload.payload;

    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-xl w-[200px]">
        <p>
          <strong>{label}</strong>
        </p>
        {extraKeys && extraKeys.length > 0 && (
          <div style={{ marginTop: "10px", borderTop: "1px dashed #ccc", paddingTop: "5px" }}>
            {extraKeys.map((key) => {
              const value = getNestedValue(rawData, key.objectDate);
              if (value !== undefined) {
                return (
                  <div key={key.objectDate} className="m-0 text-black flex flex-row items-center gap-x-1">
                    {key.title && key.title !== "" ? <strong>{key.title}</strong> : key.render && key.render()}
                    {String(value)}
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
