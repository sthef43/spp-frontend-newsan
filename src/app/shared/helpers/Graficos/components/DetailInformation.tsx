import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";

interface Props {
  extraKeys?: Array<{
    title?: string;
    objectDate?: string;
    render?: () => React.ReactNode;
    renderObjetcDate?: (value: any) => JSX.Element;
  }>;
  rawData: any;
}

export const DetailInformation: React.FC<Props> = ({ extraKeys, rawData }) => {
  const { getNestedValue } = UseUtilHooks();

  return (
    <main>
      <h1 className="text-xl font-semibold">Informacion Detallada</h1>
      {extraKeys && extraKeys.length > 0 && (
        <div className="mt-1 border-t border-gray-200 flex flex-col gap-y-2">
          {extraKeys.map((key, index) => {
            const value = key.objectDate ? getNestedValue(rawData, key.objectDate) : undefined;
            const hasValue = value !== undefined;
            const hasCustomRender = Boolean(key.renderObjetcDate);
            if (hasValue || hasCustomRender) {
              return (
                <div
                  key={key.objectDate || index}
                  className="mt-2 text-black w-full bg-background p-2 border border-gray-200 rounded-md flex flex-col">
                  {key.title && key.title !== "" ? (
                    <strong className="text-xs">{key.title}</strong>
                  ) : (
                    key.render && key.render()
                  )}
                  <span className="text-sm">
                    {key.renderObjetcDate ? key.renderObjetcDate(key.objectDate ? value : rawData) : String(value)}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </main>
  );
};
