export interface tipoDato {
  agc?: agc;
  am?: agc;
  fm?: agc;
  Maxium_Voltage_Test: datosTesteo;
  Minium_Voltage_Test: datosTesteo;
  Rated_Voltage_Test: datosTesteo;
  status?: string;
}

export interface agc {
  entrada?: [];
  salida?: [];
  Data1?: [];
  DataMenos3Db?: [];
  DataMas3Db?: [];
  Frequency_MHz?: [];
}

interface datosTesteo {
  Efficiency: string;
  Input_Current: string;
  Input_Voltage: string;
  Output_Current: string;
  Output_Voltage: string;
}

export interface InformePlacasAutomotrizSP {
    placaId: number
    codigo: string
    estado: boolean
    dataParseada?: tipoDato
    dataParseadaReferencia?: tipoDato
    dataParsedMargenError?: tipoDato
    margenError: string
    medicionReferencia: string
    testeo: string
    modelo: string
    linea: string
    fecha: string,
    proveedor: string
}
