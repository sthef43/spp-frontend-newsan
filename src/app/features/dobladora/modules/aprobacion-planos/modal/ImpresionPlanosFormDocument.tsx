import React, { useEffect } from "react";
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { IDobPlano } from "app/models/IDobPlano";
import { PDFDocument, rgb } from "pdf-lib";
// import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import moment from "moment";

interface props {
  setOpenPopup: any;
  fila: IDobPlano | null;
  impresion: number;
}

export const ImpresionPlanosFormDocument = ({ setOpenPopup, fila, impresion }: props): JSX.Element => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const modifyPDF = async () => {
    const pdfURL = `${import.meta.env.BASE_URL}imagenes/Planos/${fila.imagen}`;

    // Leer el archivo PDF
    const existingPdfBytes = await fetch(pdfURL).then((res) => res.arrayBuffer());

    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Obtener la primera página del documento
    const [page] = pdfDoc.getPages();

    if (fila.tipoHoja == 4) {
      //***********************OK
      const xp = page.getWidth() * 0.16; //left
      const yp = page.getHeight(); //top
      const ta = 7;
      const co = rgb(0, 0, 0);
      const xpt = page.getWidth() * 0.4; //left number
      const ti = 30;

      // const desp= 2.07
      // page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {x: xp,y: yp * 0.138,size: ta,color: co});
      // page.drawText(moment(fila.createdDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.138,size: ta,color: co});
      // page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {x: xp,y: yp * 0.122,size: ta,color: co});
      // page.drawText(moment(fila.verificaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.122,size: ta,color: co});
      // page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {x: xp,y: yp * 0.108,size: ta,color: co});
      // page.drawText(moment(fila.apruebaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.108,size: ta,color: co});
      // page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {x: xp,y: yp * 0.094,size: ta,color: co});
      // page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.079, size: ta, color: co });
      // page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), { x: xp, y: yp * 0.065, size: ta, color: co });
      // page.drawText( "Identificador:", { x: xpt, y: yp * 0.19, size: ta, color: co });
      // page.drawText( impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.145, size: ti, color: co });

      page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {
        x: xp,
        y: yp * 0.136,
        size: ta,
        color: co
      });
      page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {
        x: xp,
        y: yp * 0.121,
        size: ta,
        color: co
      });
      page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {
        x: xp,
        y: yp * 0.107,
        size: ta,
        color: co
      });
      page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {
        x: xp,
        y: yp * 0.093,
        size: ta,
        color: co
      });
      page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.078, size: ta, color: co });
      page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), { x: xp, y: yp * 0.064, size: ta, color: co });
      page.drawText("Identificador:", { x: xpt, y: yp * 0.19, size: ta, color: co });
      page.drawText(impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.145, size: ti, color: co });
    } else {
      if (fila.tipoHoja == 3) {
        //***********************OK
        const xp = page.getWidth() * 0.551; //left
        const yp = page.getHeight(); //top
        const ta = 7;
        const co = rgb(0, 0, 0);
        const xpt = page.getWidth() * 0.67; //left number
        const ti = 30;

        //   const desp= 1.156;
        //   page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {x: xp,y: yp * 0.139,size: ta,color: co});
        //   page.drawText(moment(fila.createdDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.139,size: ta,color: co});
        //   page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {x: xp,y: yp * 0.126,size: ta,color: co});
        //   page.drawText(moment(fila.verificaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.126,size: ta,color: co});
        //   page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {x: xp,y: yp * 0.111,size: ta,color: co});
        //   page.drawText(moment(fila.apruebaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.111,size: ta,color: co});
        //   page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {x: xp,y: yp * 0.096,size: ta,color: co});
        //   page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.082, size: ta, color: co });
        //   page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), { x: xp, y: yp * 0.068, size: ta, color: co });
        //   page.drawText( "Identificador:", { x: xpt, y: yp * 0.19, size: ta, color: co });
        //   page.drawText( impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.148, size: ti, color: co });
        // } else {
        //   if (fila.tipoHoja == 2) {//***********************OK
        //     const xp = page.getWidth() * 0.682; //left

        page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {
          x: xp,
          y: yp * 0.138,
          size: ta,
          color: co
        });
        page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {
          x: xp,
          y: yp * 0.125,
          size: ta,
          color: co
        });
        page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {
          x: xp,
          y: yp * 0.11,
          size: ta,
          color: co
        });
        page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {
          x: xp,
          y: yp * 0.095,
          size: ta,
          color: co
        });
        page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.081, size: ta, color: co });
        page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), { x: xp, y: yp * 0.067, size: ta, color: co });
        page.drawText("Identificador:", { x: xpt, y: yp * 0.19, size: ta, color: co });
        page.drawText(impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.148, size: ti, color: co });
      } else {
        if (fila.tipoHoja == 2) {
          //***********************OK
          const xp = page.getWidth() * 0.683; //left
          const yp = page.getHeight(); //top
          const ta = 6;
          const co = rgb(0, 0, 0);
          const xpt = page.getWidth() * 0.767; //left number
          const ti = 30;

          // const desp= 1.0899;
          // page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {x: xp,y: yp * 0.097,size: ta,color: co});
          // page.drawText(moment(fila.createdDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.097,size: ta,color: co});
          // page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {x: xp,y: yp * 0.087,size: ta,color: co});
          // page.drawText(moment(fila.verificaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.087,size: ta,color: co});
          // page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {x: xp,y: yp * 0.077,size: ta,color: co});
          // page.drawText(moment(fila.apruebaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.077,size: ta,color: co});
          // page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {x: xp,y: yp * 0.067,size: ta,color: co});
          // page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.057, size: ta, color: co });
          // page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {x: xp,y: yp * 0.047,size: ta,color: co});
          // page.drawText( "Identificador:", { x: xpt, y: yp * 0.135, size: ta, color: co });
          // page.drawText( impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.102, size: ti, color: co });

          page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {
            x: xp,
            y: yp * 0.097,
            size: ta,
            color: co
          });
          page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {
            x: xp,
            y: yp * 0.087,
            size: ta,
            color: co
          });
          page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {
            x: xp,
            y: yp * 0.077,
            size: ta,
            color: co
          });
          page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {
            x: xp,
            y: yp * 0.067,
            size: ta,
            color: co
          });
          page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.057, size: ta, color: co });
          page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {
            x: xp,
            y: yp * 0.046,
            size: ta,
            color: co
          });
          page.drawText("Identificador:", { x: xpt, y: yp * 0.135, size: ta, color: co });
          page.drawText(impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.102, size: ti, color: co });
        } else {
          if (fila.tipoHoja == 1) {
            //***********************OK
            const xp = page.getWidth() * 0.7759; //left 0.0074
            const yp = page.getHeight(); //top
            const ta = 6;
            const co = rgb(0, 0, 0);
            const xpt = page.getWidth() * 0.835; //left number
            const ti = 29;

            // const desp= 1.056;
            // page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {x: xp,y: yp * 0.069,size: ta,color: co});
            // page.drawText(moment(fila.createdDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.069,size: ta,color: co});
            // page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {x: xp,y: yp * 0.0617,size: ta,color: co});
            // page.drawText(moment(fila.verificaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.0617,size: ta,color: co});
            // page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {x: xp,y: yp * 0.0547,size: ta,color: co});
            // page.drawText(moment(fila.apruebaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.0547,size: ta,color: co});
            // page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {x: xp,y: yp * 0.0476,size: ta,color: co});
            // page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.0406, size: ta, color: co });
            // page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {x: xp,y: yp * 0.0332,size: ta,color: co});
            // page.drawText( "Identificador:", { x: xpt, y: yp * 0.093, size: ta, color: co });
            // page.drawText( impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.071, size: ti, color: co });

            page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {
              x: xp,
              y: yp * 0.069,
              size: ta,
              color: co
            });
            page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {
              x: xp,
              y: yp * 0.0616,
              size: ta,
              color: co
            });
            page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {
              x: xp,
              y: yp * 0.0542,
              size: ta,
              color: co
            });
            page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {
              x: xp,
              y: yp * 0.0468,
              size: ta,
              color: co
            });
            page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.04, size: ta, color: co });
            page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {
              x: xp,
              y: yp * 0.0326,
              size: ta,
              color: co
            });
            page.drawText("Identificador:", { x: xpt, y: yp * 0.093, size: ta, color: co });
            page.drawText(impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.071, size: ti, color: co });
          } else {
            if (fila.tipoHoja == 0) {
              const xp = page.getWidth() * 0.8414; //left 0.0055
              const yp = page.getHeight(); //top
              const ta = 6;
              const co = rgb(0, 0, 0);
              const xpt = page.getWidth() * 0.8845; //left number
              const ti = 29;

              // const desp= 1.0362;
              // page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {x: xp,y: yp * 0.0492,size: ta,color: co});
              // page.drawText(moment(fila.createdDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.0492,size: ta,color: co});
              // page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {x: xp,y: yp * 0.0438,size: ta,color: co});
              // page.drawText(moment(fila.verificaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.0438,size: ta,color: co});
              // page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {x: xp,y: yp * 0.0388,size: ta,color: co});
              // page.drawText(moment(fila.apruebaDate).format("DD-MM-YY"), {x: xp * desp,y: yp * 0.0388,size: ta,color: co});
              // page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {x: xp,y: yp * 0.0338,size: ta,color: co});
              // page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.0287, size: ta, color: co });
              // page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {x: xp,y: yp * 0.0237,size: ta,color: co});
              // page.drawText( "Identificador:", { x: xpt, y: yp * 0.067, size: ta, color: co });
              // page.drawText( impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.052, size: ti, color: co });

              page.drawText(fila.dibuja.operator.name + " " + fila.dibuja.operator.surname, {
                x: xp,
                y: yp * 0.0492,
                size: ta,
                color: co
              });
              page.drawText(fila.verifica.operator.name + " " + fila.verifica.operator.surname, {
                x: xp,
                y: yp * 0.0437,
                size: ta,
                color: co
              });
              page.drawText(fila.aprueba.operator.name + " " + fila.aprueba.operator.surname, {
                x: xp,
                y: yp * 0.0387,
                size: ta,
                color: co
              });
              page.drawText(infoUser.operator.name + " " + infoUser.operator.surname, {
                x: xp,
                y: yp * 0.0337,
                size: ta,
                color: co
              });
              page.drawText(moment().format("DD-MM-YYYY HH:mm"), { x: xp, y: yp * 0.0286, size: ta, color: co });
              page.drawText((fila.dobImpresionesPlanos.length + 1).toString(), {
                x: xp,
                y: yp * 0.0236,
                size: ta,
                color: co
              });
              page.drawText("Identificador:", { x: xpt, y: yp * 0.067, size: ta, color: co });
              page.drawText(impresion.toString().padStart(6, "000000"), { x: xpt, y: yp * 0.052, size: ti, color: co });
            }
          }
        }
      }
    }

    // Guardar el PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();

    // Crear un blob con el PDF modificado
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

    // Crear un enlace para descargar el PDF modificado
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(modifiedPdfBlob);
    downloadLink.download = `Plano-Aprobado-${fila.imagen}`;
    downloadLink.click();
  };

  useEffect(() => {
    console.log(fila);
    console.log(impresion);
    modifyPDF();
    setOpenPopup(false);
  }, [fila && impresion]);

  return <></>;
};
