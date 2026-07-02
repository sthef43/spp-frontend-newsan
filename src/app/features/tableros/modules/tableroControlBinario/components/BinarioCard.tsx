/* eslint-disable unused-imports/no-unused-vars */
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { TrazaOperaciones } from "app/models/ITrazaOperaciones";
import _, { Dictionary } from "lodash";
import React from "react";
interface IBinario {
  binario: IBinariosIdentificadores;
  binarios: Dictionary<TrazaOperaciones[]>;
  binariosAcum: Dictionary<TrazaOperaciones[]>;
  binariosToday: Dictionary<TrazaOperaciones[]>;
  keyBin: number;
  cambioFecha: boolean;
}
export const BinarioCard = ({
  binario,
  binarios,
  binariosAcum,
  binariosToday,
  keyBin,
  cambioFecha
}: IBinario): JSX.Element => {
  const [binarioFamilia, setBinarioFamilia] = React.useState<Dictionary<TrazaOperaciones[]>>({});
  const [binarioFamiliaAcum, setBinarioFamiliaAcum] = React.useState<Dictionary<TrazaOperaciones[]>>({});
  const [keysFamilia, setKeysFamilia] = React.useState<string[]>([]);
  const [producido, setProducido] = React.useState<number>(0);
  const [contar, setContar] = React.useState<boolean>(false);
  const [actualizarKey, setActualizarKey] = React.useState<boolean>(false);

  //Obtener acumulados por familia desde binarioIdentificadores que traigo con el SP
  const getAcumulado = (kf: string) => {
    const d = binario.acumuladoBinarios.find((d) => d.familia.toUpperCase() == kf.toUpperCase());
    if (!d) return 0;
    return d.acumulado;
  };
  const getDiario = (kf: string) => {
    const d = binario.acumuladoBinarios.find((d) => d.familia.toUpperCase() == kf.toUpperCase());
    if (!d) return 0;
    return d.diario;
  };

  const getBinFamilia = () => {
    const group = _.groupBy(binarios[keyBin], "familia");
    setBinarioFamilia(group);
    setKeysFamilia(Object.keys(group));
    setContar(!contar);
  };
  const getBinFamiliaAcum = () => {
    const group = _.groupBy(binariosAcum[keyBin], "familia");
    setBinarioFamiliaAcum(group);
  };
  const getProducido = () => {
    const acum = keysFamilia?.reduce((total, k) => total + (binarioFamilia[k]?.length || 0), 0);
    setProducido(acum || 0);
  };
  // Setea los nuevos valores si no existen, sino los agrega al dictionary rey
  const setNewValues = (array: IBinariosIdentificadores) => {
    if (binario) {
      const acumulados = binario.acumuladoBinarios.filter((d) => d.diario > 0);
      if (acumulados.length > 0) {
        const keys = Object.keys(_.groupBy(acumulados, "familia"));
        setKeysFamilia(keys);
      }
    }
  };
  // Actualizo las key para que vuelva a renderizar las tarjetas
  React.useEffect(() => {
    setKeysFamilia([...keysFamilia]);
  }, [actualizarKey]);
  React.useEffect(() => {
    keysFamilia && getProducido();
  }, [contar]);
  React.useEffect(() => {
    binarios && getBinFamilia();
  }, [binarios]);
  React.useEffect(() => {
    binariosAcum && getBinFamiliaAcum();
  }, [binariosAcum]);
  React.useEffect(() => {
    binario && setNewValues(binario);
  }, [binario]);
  // Si cambio la fecha reseteo todos los states
  React.useEffect(() => {
    if (cambioFecha) {
      !binarios && setBinarioFamilia({});
      !binarios && setKeysFamilia([]);
      !binariosAcum && setBinarioFamiliaAcum({});
      !binarios && setContar(!contar);
    }
  }, [cambioFecha]);
  return (
    <div className={`h-full flex flex-col justify-center gap-3 items-center`}>
      <div
        className={`shadow-elevation-4 text-center `}
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "10px"
        }}>
        <h1
          style={{ fontFamily: "Montserrat", color: "#7FE2FF", padding: "10px 70px 10px 70px" }}
          className="w-full text-3xl font-bold">
          {binario?.nombre}
        </h1>
      </div>
      <Grid
        gridRow={2}
        container
        direction="column"
        justifyContent="flex-start"
        wrap="nowrap"
        alignItems="center"
        height="100%"
        spacing={2}>
        <Grid item height={"100%"} width={"100%"}>
          <TableContainer component={Paper}>
            <Table
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
              }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#20234A", fontFamily: "Roboto", fontSize: 30 }}
                    colSpan={2}
                    align="center">
                    Diario
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keysFamilia.map((familia, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" style={{ fontSize: 40, padding: 0 }}>
                      {familia}
                    </TableCell>
                    <TableCell align="right" style={{ color: "#C5FF29", fontSize: 40, padding: 0 }}>
                      {getDiario(familia)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item height={"100%"} width={"100%"}>
          <TableContainer component={Paper}>
            <Table
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}imagenes/fondos/fondo-tablero.png)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
              }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#20234A", fontFamily: "Roboto", fontSize: 30 }}
                    colSpan={2}
                    align="center">
                    Acumulado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keysFamilia.map((familia, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" style={{ fontSize: 40, padding: 0 }}>
                      {familia}
                    </TableCell>
                    <TableCell align="right" style={{ color: "#FEC0C1", fontSize: 40, padding: 0 }}>
                      {getAcumulado(familia)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};
