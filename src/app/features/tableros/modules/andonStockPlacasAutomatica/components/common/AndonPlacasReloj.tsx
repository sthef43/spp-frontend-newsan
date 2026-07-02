import React, { useState, useEffect } from "react";
import moment from "moment";

export default function AndonPlacasReloj() {
  const [horaActual, setHoraActual] = useState<string>(moment().format("HH:mm:ss"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHoraActual(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-black rounded-md">
      <h2 className="w-full text-8xl text-white font-bold m-[5px] p-[5px]">{horaActual}</h2>
    </div>
  );
}
