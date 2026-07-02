import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { IDotaHistorico } from "app/models/IDotaHistorico";
import { IHoraExtra } from "app/models/IHoraExtra";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { IRechazoDobladora } from "app/features/calidad/modules/cargaNoConformeCanios/Models/IRechazoDobladora";
import { ITickets } from "app/features/tickets/models/ITickets";
import { ITicketsItemsProcesosResultados } from "app/features/tickets/models/ITicketsItemsProcesosResultados";
import axios from "axios";

interface IPropsSendEmailDotacionVigente {
  dotaFamiliaId: number;
  plantId: number;
  lineaProduccionId: number;
  listDotaHistoric: IDotaHistorico[];
}
export class EmailService {
  Url = "Mail";

  public AuditEmail(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-auditoria/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public EmailProductoTerminado(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-productoTerminado/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  //Mails de rechazos
  public RechazosEmail(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-rechazos/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async SendEmailRechazoCanios(entidad: IRechazoDobladora): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailRechazoCanios`, entidad)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public CierreLoteEmail(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-cierreLote/${id}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public CierreLoteCondicionalEmail(modelA: number, modelB: string, modelC: string, modelD: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-cierreLote-condicional/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public PedidoMaterialEmail(modelA: number, modelB: string, modelC: string, modelD: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/email-pedido-material/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public PedidoMaterialCalidadEmail(modelA: number, modelB: string, modelC: string, modelD: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-pedido-material-calidad/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public CierreLoteGerenciaEmail(modelA: number, modelB: string, modelC: string, modelD: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-cierreLote-gerencia/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public PedidoMaterialesAdministracionEmail(
    modelA: number,
    modelB: string,
    modelC: string,
    modelD: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-pedidoMat-administracion/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public PedidoMaterialesCalidadAdministracionEmail(
    modelA: number,
    modelB: string,
    modelC: string,
    modelD: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-pedidoMat-administracion-calidad/${modelA}/${modelB}/${modelC}/${modelD}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public PautaIngenieriaAprobadaCambioVersionEmail(
    pautaIngenieriaAprobadaId: number,
    appUserId: number,
    emailsDestino: string,
    versionProceso: string,
    puesto: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-cambioVersion-pautaIngenieria/${pautaIngenieriaAprobadaId}/${appUserId}/${emailsDestino}/${versionProceso}/${puesto}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public PlanosCambioEstado(
    usuario: string,
    semi: string,
    estado: string,
    comentario: string,
    emailsDestiners: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-cambioEstado-planoDobladora/${usuario}/${semi}/${estado}/${comentario}/${emailsDestiners}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public HojaDeParametros(
    planta: string,
    producto: string,
    usuario: string,
    modelo: string,
    marca: string,
    proveedor: string,
    version: number,
    estado: string,
    emailsDestiners: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-hojaDeParametros-calidad/${planta}/${producto}/${usuario}/${modelo}/${marca}/${proveedor}/${version}/${estado}/${emailsDestiners}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public Planificacion(
    fecha: string,
    prioridad: number,
    planta: string,
    contenedor: string,
    emailsDestiners: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-planificacion/${fecha}/${prioridad}/${planta}/${contenedor}/${emailsDestiners}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public ParadaLinea(
    fecha: string,
    fechaFin: string,
    hsInicio: string,
    hsFin: string,
    causa: string,
    supervisor: string,
    lineaProduccionId: number,
    minutos: number,
    plantId: number,
    sectr: string,
    disc: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .get<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-paradaLinea/${fecha}/${fechaFin}/${hsInicio}/${hsFin}/${causa}/${supervisor}/${lineaProduccionId}/${minutos}/${plantId}/${sectr}/${disc}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public CalidadAprobacionReprocesoEmail(
    linea: string,
    modelo: string,
    array: [],
    supervisor: string,
    emailsDestiners: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/email-calidadAprobacionReproceso/${linea}/${modelo}/${supervisor}/${emailsDestiners}`,
          array
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  //Mails de auditorias
  public AuditTrackingEmailGroup(auditTrackingId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-seguimientoAuditoria/${auditTrackingId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public SendEmailAuditTrackingEmailGroup(auditTrackingId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/email-SendMailAuditoria/${auditTrackingId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  public async SendMailAuditoriaNew(auditoriaId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendMailAuditoriaNew/${auditoriaId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public sendPauseOfPrinter(
    previousRfid: string,
    lastRfid: string,
    missingRfid: string,
    namePrinter: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(
          `${import.meta.env.VITE_API_URL}/${
            this.Url
          }/SendPauseOfPrinter/${previousRfid}/${lastRfid}/${missingRfid}/${namePrinter}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public sendMailDiferencia(model: IDobCaniosSub): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendMailDiferencia`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public sendMailHoraExtra(model: IHoraExtra): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendMailHoraExtra`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public sendEmailOQC(model: IOQCDesignadaResultado): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailOQC`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public SendEmailNewOQC(model: IOQCDesignadaResultado): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailNewOQC`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  //Modulo de tickets
  public SendEmailTicket(model: ITickets): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailTicket`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public SendEmailStateTicket(model: ITickets): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailStateTicket`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public SendEmailTicketProceso(model: ITicketsItemsProcesosResultados): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailTicketProceso`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  //Modulo de tickets

  public SendEmailDotacionVigente(model: IPropsSendEmailDotacionVigente): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendEmailDotacionVigente`, model)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public SendMailAuditoriaSeguridadEHigiene(auditoriaId: number[]) {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/SendMailSEHAuditoria`, auditoriaId)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
