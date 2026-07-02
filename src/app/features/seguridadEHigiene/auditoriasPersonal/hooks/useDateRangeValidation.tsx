import moment from "moment";
import { useEffect, useState } from "react";

export const useDateRangeValidation = (startDate, endDate, maxDays = null) => {
  const [errors, setErrors] = useState({
    startDate: { hasError: false, message: "" },
    endDate: { hasError: false, message: "" }
  });

  useEffect(() => {
    const newErrors = {
      startDate: { hasError: false, message: "" },
      endDate: { hasError: false, message: "" }
    };

    if (!startDate || !endDate) {
      setErrors(newErrors);
      return;
    }

    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    if (!startMoment.isValid()) {
      newErrors.startDate = { hasError: true, message: "Fecha Invalida" };
      setErrors(newErrors);
      return;
    }

    if (!endMoment.isValid()) {
      newErrors.endDate = { hasError: true, message: "Fecha Invalida" };
      setErrors(newErrors);
      return;
    }

    // Validación básica: 'Desde' no puede ser mayor que 'Hasta'
    if (startMoment.isAfter(endMoment)) {
      newErrors.startDate = { hasError: true, message: "La fecha no puede ser mayor que la final" };
      newErrors.endDate = { hasError: true, message: "La fecha no puede ser menor que la inicial" };
      setErrors(newErrors);
      return;
    }

    // Validación opcional: si se pasa 'maxDays', verificamos el rango
    if (maxDays && endMoment.diff(startMoment, "days") > maxDays) {
      newErrors.startDate = { hasError: true, message: `El rango no puede exceder los ${maxDays} días` };
      newErrors.endDate = { hasError: true, message: `El rango no puede exceder los ${maxDays} días` };
      setErrors(newErrors);
      return;
    }

    // Si todo es válido, limpiamos los errores
    setErrors(newErrors);
  }, [startDate, endDate, maxDays]); // El hook se ejecuta cuando 'maxDays' también cambia

  return {
    errors,
    isInvalid: errors.startDate.hasError || errors.endDate.hasError
  };
};
