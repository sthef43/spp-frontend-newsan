import React from "react";
import { IOperator, IPlant } from "app/models";
import { IOQCBloqueGroup } from "app/models/IOQCBloqueGroup";
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { IOQCNuevoPallet } from "app/models/IOQCNuevoPallet";
import { IOQCPalet } from "app/models/IOQCPalet";
import { IOQCSupervisoresMotorola } from "app/models/IOQCSupervisoresMotorola";
import { IOQCModelo } from "app/models/IOQModelo";
import { IXXE_WIP_ITF_SERIE } from "app/models/IXXE_WIP_ITF_SERIE";
import { createContext, useState } from "react";

interface dateContext {
  masterBox: boolean;
  datosZampling: boolean;
  confirmarCierreMasterBox: boolean;
  mostrarHallazgos: boolean;
  examinarPallet: boolean;
  muestrasPallet: boolean;
  continuarPallet: boolean;
  abrirVerDatosParaAgregar: boolean;
  agregarSupervisor: boolean;
  eliminarMuestra: boolean;
  openModalTickectProducto: boolean;
  codigoLpn: string;
  obaTest: string;
  packing: string;
  estetica: string;
  nombreLinea: string;
  nombreModelo: string;
  supervisor: string;
  organitazionCode: string;
  nombrePallet: string;
  nombreAuditor: string;
  DNIOperator: number;
  productoId: number;
  plantaIdAuditor: number;
  listaPlantas: IPlant[];
  listaOperarios: IOQCSupervisoresMotorola[];
  planta: IPlant;
  modeloSeleccionado: IOQCModelo[];
  listaHallazgos: IOQCHallazgo[];
  modeloIngresadoPorEAN: IOQCModelo;
  getDatosModelo: IXXE_WIP_ITF_SERIE[];
  getPaletIngresado: IOQCNuevoPallet[];
  todosOperadores: IOperator[];
  palletCreado: IOQCPalet;
  paletExistentes: IOQCPalet[];
  comentariosNg: any[];
  verDatosParaAniadir: any[];
  masterBoxYaIngresadas: string[];
  bloquesGroup: IOQCBloqueGroup[];
  auditor: IOperator;
  lineaSeleccionadaId: number;
  oqcDesigandaId: number;
  modeloSeleccionadoId: number;
  auditorId: number;
  paletId: number;
  equiposControlados: number;
  OQCId: number;
  plantaId: number;

  setConfirmarCierreMasterBox: (newValue: boolean) => void;
  setMasterBox: (newValue: boolean) => void;
  setDatosZampling: (newValue: boolean) => void;
  setMostrarHallazgos: (newValue: boolean) => void;
  setExaminarPallet: (newValue: boolean) => void;
  setMuestrasPallet: (newValue: boolean) => void;
  setContinuarPallet: (newValue: boolean) => void;
  setAgregarSupervisor: (newValue: boolean) => void;
  setEliminarMuestra: (newValue: boolean) => void;
  setAbrirVerDatosParaAgregar: (newValue: boolean) => void;
  setOpenModalTickectProducto: (newValue: boolean) => void;
  cerrarDatosZamplingAndMasterBox: (newValue: void) => void;
  setCodigoLpn: (newValue: string) => void;
  setLineaSeleccionadaId: (newValue: number) => void;
  setDNIOperator: (newValue: number) => void;
  setProductoId: (newValue: number) => void;
  setPlantaIdAuditor: (newValue: number) => void;
  setEquiposControlados: (newValue: number) => void;
  setPlantaId: (newValue: number) => void;
  setOQCId: (newValue: number) => void;
  setListaPlantas: (newValue: IPlant[]) => void;
  setListaOperarios: (newValue: IOQCSupervisoresMotorola[]) => void;
  setPlanta: (newValue: IPlant) => void;
  setModeloSeleccionado: (newValue: IOQCModelo[]) => void;
  setAuditor: (newValue: IOperator) => void;
  setBloquesGroup: (newValue: IOQCBloqueGroup[]) => void;
  setListaHallazgos: (newValue: IOQCHallazgo[]) => void;
  setModeloIngresadoPorEan: (newValue: IOQCModelo) => void;
  setTodosOperadores: (newValue: IOperator[]) => void;
  setGetDatosModelo: (newValue: IXXE_WIP_ITF_SERIE[] | ((prev: any[]) => any[])) => void;
  setPaletIngresado: (newValue: IOQCNuevoPallet[] | ((prev: any[]) => any[])) => void;
  setVerDatosParaAniadir: (newValue: [] | ((prev: any[]) => any[])) => void;
  setMasterBoxYaIngresadas: (newValue: string[]) => void;
  setPaletsExistentes: (newValue: IOQCPalet[]) => void;
  setPalletCreado: (newValue: IOQCPalet) => void;
  setComentariosNg: (newValue: any[] | ((prev: any[]) => any[])) => void;
  setOqcDesigandaId: (newValue: number) => void;
  setModeloSeleccionadoId: (newValue: number) => void;
  setAuditorId: (newValue: number) => void;
  setPaletId: (newValue: number) => void;
  setOrganizationCode: (newValue: string) => void;
  setNombreLinea: (newValue: string) => void;
  setNombreModelo: (newValue: string) => void;
  setNombrePallet: (newValue: string) => void;
  setNombreAuditor: (newValue: string) => void;
}

export const ContextApp = createContext<dateContext | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, react/prop-types
export const MyProvider = ({ children }) => {
  const estetica = "";
  const packing = "";
  const obaTest = "";
  const supervisor = "";

  const [masterBox, setMasterBox] = useState<boolean>(false);
  const [datosZampling, setDatosZampling] = useState<boolean>(false);
  const [confirmarCierreMasterBox, setConfirmarCierreMasterBox] = useState<boolean>(false);
  const [mostrarHallazgos, setMostrarHallazgos] = useState(false);
  const [examinarPallet, setExaminarPallet] = useState(false);
  const [muestrasPallet, setMuestrasPallet] = useState(false);
  const [continuarPallet, setContinuarPallet] = useState(false);
  const [abrirVerDatosParaAgregar, setAbrirVerDatosParaAgregar] = useState(false);
  const [agregarSupervisor, setAgregarSupervisor] = useState(false);
  const [eliminarMuestra, setEliminarMuestra] = useState(false);
  const [openModalTickectProducto, setOpenModalTickectProducto] = useState(false);
  const [listaOperarios, setListaOperarios] = useState<IOQCSupervisoresMotorola[]>([]);
  const [planta, setPlanta] = useState<IPlant>();
  const [modeloSeleccionado, setModeloSeleccionado] = useState<IOQCModelo[]>([]);
  const [getDatosModelo, setGetDatosModelo] = useState<IXXE_WIP_ITF_SERIE[]>([]);
  const [getPaletIngresado, setPaletIngresado] = useState<IOQCNuevoPallet[]>([]);
  const [listaHallazgos, setListaHallazgos] = useState<IOQCHallazgo[]>([]);
  const [palletCreado, setPalletCreado] = useState<IOQCPalet>();
  const [todosOperadores, setTodosOperadores] = useState<IOperator[]>([]);
  const [paletExistentes, setPaletsExistentes] = useState<IOQCPalet[]>([]);
  const [modeloIngresadoPorEAN, setModeloIngresadoPorEan] = useState<IOQCModelo>();
  const [bloquesGroup, setBloquesGroup] = useState<IOQCBloqueGroup[]>([]);
  const [listaPlantas, setListaPlantas] = useState<IPlant[]>([]);
  const [auditor, setAuditor] = useState<IOperator>();
  const [DNIOperator, setDNIOperator] = useState<number>(0);
  const [productoId, setProductoId] = useState(0);
  const [plantaIdAuditor, setPlantaIdAuditor] = useState(0);
  const [comentariosNg, setComentariosNg] = useState<any[]>([]);
  const [verDatosParaAniadir, setVerDatosParaAniadir] = useState([]);
  const [masterBoxYaIngresadas, setMasterBoxYaIngresadas] = useState([]);
  const [lineaSeleccionadaId, setLineaSeleccionadaId] = useState<number>(0);
  const [oqcDesigandaId, setOqcDesigandaId] = useState<number>(0);
  const [modeloSeleccionadoId, setModeloSeleccionadoId] = useState<number>(0);
  const [auditorId, setAuditorId] = useState<number>(0);
  const [paletId, setPaletId] = useState<number>(0);
  const [equiposControlados, setEquiposControlados] = useState<number>(0);
  const [OQCId, setOQCId] = useState<number>(0);
  const [plantaId, setPlantaId] = useState<number>(0);
  const [organitazionCode, setOrganizationCode] = useState("");
  const [nombreLinea, setNombreLinea] = useState<string>("");
  const [nombreModelo, setNombreModelo] = useState<string>("");
  const [codigoLpn, setCodigoLpn] = useState<string>("");
  const [nombrePallet, setNombrePallet] = useState<string>("");
  const [nombreAuditor, setNombreAuditor] = useState<string>("");

  const cerrarDatosZamplingAndMasterBox = () => {
    setDatosZampling(false);
    setMasterBox(false);
    setConfirmarCierreMasterBox(false);
  };

  return (
    <ContextApp.Provider
      value={{
        openModalTickectProducto,
        eliminarMuestra,
        agregarSupervisor,
        listaPlantas,
        listaOperarios,
        planta,
        plantaId,
        todosOperadores,
        organitazionCode,
        OQCId,
        equiposControlados,
        bloquesGroup,
        paletId,
        auditorId,
        muestrasPallet,
        palletCreado,
        continuarPallet,
        verDatosParaAniadir,
        masterBox,
        datosZampling,
        examinarPallet,
        paletExistentes,
        confirmarCierreMasterBox,
        abrirVerDatosParaAgregar,
        modeloSeleccionado,
        listaHallazgos,
        mostrarHallazgos,
        masterBoxYaIngresadas,
        codigoLpn,
        productoId,
        estetica,
        packing,
        obaTest,
        nombreLinea,
        nombreModelo,
        nombrePallet,
        supervisor,
        DNIOperator,
        comentariosNg,
        plantaIdAuditor,
        modeloIngresadoPorEAN,
        lineaSeleccionadaId,
        oqcDesigandaId,
        modeloSeleccionadoId,
        auditor,
        getDatosModelo,
        nombreAuditor,
        getPaletIngresado,
        setOpenModalTickectProducto,
        setEliminarMuestra,
        setAgregarSupervisor,
        setListaPlantas,
        setListaOperarios,
        setPlanta,
        setPlantaId,
        setTodosOperadores,
        setNombreAuditor,
        setOrganizationCode,
        setEquiposControlados,
        setBloquesGroup,
        setOQCId,
        setPaletId,
        setPaletsExistentes,
        setAuditorId,
        setMuestrasPallet,
        setContinuarPallet,
        setPalletCreado,
        setPaletIngresado,
        setGetDatosModelo,
        setAuditor,
        setMasterBox,
        setDatosZampling,
        setExaminarPallet,
        setConfirmarCierreMasterBox,
        cerrarDatosZamplingAndMasterBox,
        setAbrirVerDatosParaAgregar,
        setModeloSeleccionado,
        setVerDatosParaAniadir,
        setMasterBoxYaIngresadas,
        setCodigoLpn,
        setProductoId,
        setListaHallazgos,
        setMostrarHallazgos,
        setDNIOperator,
        setComentariosNg,
        setPlantaIdAuditor,
        setModeloIngresadoPorEan,
        setLineaSeleccionadaId,
        setOqcDesigandaId,
        setModeloSeleccionadoId,
        setNombreLinea,
        setNombreModelo,
        setNombrePallet
      }}>
      {children}
    </ContextApp.Provider>
  );
};
