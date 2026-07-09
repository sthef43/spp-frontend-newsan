interface Props {
  setActiveLayout: (activeLayout: "Lineas" | "Barras" | "Circular" | "Area") => void;
}

export const GroupButtons = ({ setActiveLayout }: Props) => {
  const listaBotones: Array<{ label: string; value: "Lineas" | "Barras" | "Circular" | "Area" }> = [
    { label: "Grafico Linea", value: "Lineas" },
    { label: "Grafico Area", value: "Area" },
    { label: "Grafico Circular", value: "Circular" },
    { label: "Grafico de Barras", value: "Barras" }
  ];

  return (
    <div className="flex flex-row w-fit gap-x-4 border border-gray-300 p-3 shadow-md rounded-md bg-secondaryNew justify-start items-center">
      {listaBotones.map((item) => {
        return (
          <button key={item.label} className="buttonSelectorGraphics" onClick={() => setActiveLayout(item.value)}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
