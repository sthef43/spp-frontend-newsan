/* eslint-disable unused-imports/no-unused-vars */
import { EmailService } from "app/services/Email.Service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IDobCaniosSub } from "app/models/IDobCaniosSub";
import { IHoraExtra } from "app/models/IHoraExtra";
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { IDotaHistorico } from "app/models/IDotaHistorico";
import { ITickets } from "app/features/tickets/models/ITickets";
import { ITicketsItemsProcesosResultados } from "app/features/tickets/models/ITicketsItemsProcesosResultados";
import { IRechazoDobladora } from "app/features/calidad/modules/cargaNoConformeCanios/Models/IRechazoDobladora";

interface props {
  planProd: number;
  infoSupervisor: string;
  observaciones: string;
  descripLinea: number;
}
interface propsAdministracion {
  planProd: number;
  infoSupervisor: string;
  observaciones: string;
  descripLinea: number;
}
interface propsCalidad {
  controlLote: number;
  infoSupervisor: string;
  observaciones: string;
  descripLinea: number;
}
interface propsPlanosCambioEstado {
  usuario: string;
  semi: string;
  estado: string;
  comentario: string;
  emailsDestiners: string;
}
export interface propsHojaDeParametros {
  producto: string;
  familia: string;
  usuario: string;
  modelo: string;
  marca: string;
  proveedor: string;
  version: number;
  estado: string;
  emailsDestiners: string;
}
interface propsPlanificacionContenedores {
  fecha: string;
  prioridad: number;
  planta: string;
  contenedor: string;
  emailsDestiners: string;
}
interface propsPautaIngenieria {
  pautaIngenieriaAprobadaId: number;
  appUserId: number;
  emailsDestino: string;
  versionProceso: string;
  puesto: string;
}
interface propsParadaLinea {
  fecha: string;
  fechaFin: string;
  hsInicio: string;
  hsFin: string;
  causa: string;
  supervisor: string;
  lineaProduccionId: number;
  minutos: number;
  plantId: number;
  sectr: string;
  disc: string;
}
interface PropsCalidadAprobacionReproceso {
  linea: string;
  modelo: string;
  array: [];
  supervisor: string;
  emailsDestiners: string;
}
interface IPropsRFIDPause {
  previousRfid: string;
  lastRfid: string;
  missingRfid: string;
  namePrinter: string;
}

interface IPropsSendEmailDotacionVigente {
  dotaFamiliaId: number;
  plantId: number;
  lineaProduccionId: number;
  listDotaHistoric: IDotaHistorico[];
}

const emailService = new EmailService();
class emailSlice {
  constructor(private service: EmailService) {}
  EmailAuditoria = createAsyncThunk<boolean, number>("Email/email-auditoria", async (modelo, info) => {
    return await errorNotification(() => this.service.AuditEmail(modelo), info);
  });
  EmailProductoTerminado = createAsyncThunk<boolean, number>("Email/email-productoTerminado", async (modelo, info) => {
    return await errorNotification(() => this.service.EmailProductoTerminado(modelo), info);
  });

  // Emails Rechazos
  EmailRechazos = createAsyncThunk<boolean, number>("Email/email-rechazos", async (modelo, info) => {
    return await errorNotification(() => this.service.RechazosEmail(modelo), info);
  });
  SendEmailRechazoCanios = createAsyncThunk<boolean, IRechazoDobladora>(
    "Email/SendEmailRechazoCanios",
    async (modelo, info) => {
      return await errorNotification(() => this.service.SendEmailRechazoCanios(modelo), info);
    }
  );
  EmailCierreLote = createAsyncThunk<boolean, number>("Email/email-cierreLote", async (modelo, info) => {
    return await errorNotification(() => this.service.CierreLoteEmail(modelo), info);
  });
  EmailCierreLoteCondicional = createAsyncThunk<boolean, props>(
    "Email/email-cierreLote-condicional",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.CierreLoteCondicionalEmail(
            modelo.planProd,
            modelo.infoSupervisor,
            modelo.observaciones,
            modelo.descripLinea
          ),
        info
      );
    }
  );
  EmailPedidoMaterial = createAsyncThunk<boolean, props>("Email/email-pedido-material", async (modelo, info) => {
    return await errorNotification(
      () =>
        this.service.PedidoMaterialEmail(
          modelo.planProd,
          modelo.infoSupervisor,
          modelo.observaciones,
          modelo.descripLinea
        ),
      info
    );
  });
  EmailPedidoMaterialCalidad = createAsyncThunk<boolean, propsCalidad>(
    "Email/email-pedido-material-calidad",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.PedidoMaterialCalidadEmail(
            modelo.controlLote,
            modelo.infoSupervisor,
            modelo.observaciones,
            modelo.descripLinea
          ),
        info
      );
    }
  );
  EmailCierreLoteGerencia = createAsyncThunk<boolean, props>(
    "Email/email-cierreLote-gerencia",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.CierreLoteGerenciaEmail(
            modelo.planProd,
            modelo.infoSupervisor,
            modelo.observaciones,
            modelo.descripLinea
          ),
        info
      );
    }
  );
  EmailPedidoMaterialesAdministracion = createAsyncThunk<boolean, propsAdministracion>(
    "Email/email-pedidoMat-administracion",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.PedidoMaterialesAdministracionEmail(
            modelo.planProd,
            modelo.infoSupervisor,
            modelo.observaciones,
            modelo.descripLinea
          ),
        info
      );
    }
  );
  PedidoMaterialesCalidadAdministracionEmail = createAsyncThunk<boolean, propsCalidad>(
    "Email/email-pedidoMat-administracion-calidad",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.PedidoMaterialesCalidadAdministracionEmail(
            modelo.controlLote,
            modelo.infoSupervisor,
            modelo.observaciones,
            modelo.descripLinea
          ),
        info
      );
    }
  );
  PautaIngenieriaAprobadaCambioVersionEmail = createAsyncThunk<boolean, propsPautaIngenieria>(
    "Email/email-cambioVersion-pautaIngenieria",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.PautaIngenieriaAprobadaCambioVersionEmail(
            modelo.pautaIngenieriaAprobadaId,
            modelo.appUserId,
            modelo.emailsDestino,
            modelo.versionProceso,
            modelo.puesto
          ),
        info
      );
    }
  );

  EmailParadaLinea = createAsyncThunk<boolean, propsParadaLinea>("Email/email-paradaLinea", async (modelo, info) => {
    return await errorNotification(
      () =>
        this.service.ParadaLinea(
          modelo.fecha,
          modelo.fechaFin,
          modelo.hsInicio,
          modelo.hsFin,
          modelo.causa,
          modelo.supervisor,
          modelo.lineaProduccionId,
          modelo.minutos,
          modelo.plantId,
          modelo.sectr,
          modelo.disc
        ),
      info
    );
  });

  EmailAprobacionPlanos = createAsyncThunk<boolean, propsPlanosCambioEstado>(
    "Email/email-cambioEstado",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.PlanosCambioEstado(
            modelo.usuario,
            modelo.semi,
            modelo.estado,
            modelo.comentario,
            modelo.emailsDestiners
          ),
        info
      );
    }
  );

  EmailHojaDeParametros = createAsyncThunk<boolean, propsHojaDeParametros>(
    "Email/email-hojaDeParametros",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.HojaDeParametros(
            modelo.producto,
            modelo.familia,
            modelo.usuario,
            modelo.modelo,
            modelo.marca,
            modelo.proveedor,
            modelo.version,
            modelo.estado,
            modelo.emailsDestiners
          ),
        info
      );
    }
  );

  EmailPlanificacionContenedores = createAsyncThunk<boolean, propsPlanificacionContenedores>(
    "Email/email-planificacion",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.Planificacion(
            modelo.fecha,
            modelo.prioridad,
            modelo.planta,
            modelo.contenedor,
            modelo.emailsDestiners
          ),
        info
      );
    }
  );

  CalidadAprobacionReprocesoEmail = createAsyncThunk<boolean, PropsCalidadAprobacionReproceso>(
    "Email/email-calidadAprobacionReproceso",
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.CalidadAprobacionReprocesoEmail(
            modelo.linea,
            modelo.modelo,
            modelo.array,
            modelo.supervisor,
            modelo.emailsDestiners
          ),
        info
      );
    }
  );

  //Mails de auditorias
  AuditTrackingEmailGroupRequest = createAsyncThunk<boolean, number>(
    "Email/email-seguimientoAuditoria",
    async (auditTrackingId, info) => {
      return await errorNotification(() => this.service.AuditTrackingEmailGroup(auditTrackingId), info);
    }
  );
  SendEmailAuditTrackingEmailGroup = createAsyncThunk<boolean, number>(
    "Email/email-SendMailAuditoria",
    async (auditTrackingId, info) => {
      return await errorNotification(() => this.service.SendEmailAuditTrackingEmailGroup(auditTrackingId), info);
    }
  );
  SendMailAuditoriaNew = createAsyncThunk<boolean, number>(
    "Email/SendMailAuditoriaNew",
    async (auditTrackingId, info) => {
      return await errorNotification(() => this.service.SendMailAuditoriaNew(auditTrackingId), info);
    }
  );
  //Mails de auditorias

  SendEmailPausePrinterRfid = createAsyncThunk<boolean, IPropsRFIDPause>(
    "Email/SendPauseOfPrinter",
    async ({ previousRfid, lastRfid, missingRfid, namePrinter }, info) => {
      return await errorNotification(
        () => this.service.sendPauseOfPrinter(previousRfid, lastRfid, missingRfid, namePrinter),
        info
      );
    }
  );
  SendMailDiferencia = createAsyncThunk<boolean, IDobCaniosSub>("Email/SendMailDiferencia", async (model, info) => {
    return await errorNotification(() => this.service.sendMailDiferencia(model), info);
  });
  SendMailHoraExtra = createAsyncThunk<boolean, IHoraExtra>("Email/SendMailHoraExtra", async (model, info) => {
    return await errorNotification(() => this.service.sendMailHoraExtra(model), info);
  });
  SendEmailOQC = createAsyncThunk<boolean, IOQCDesignadaResultado>("Email/SendEmailOQC", async (model, info) => {
    return await errorNotification(() => this.service.sendEmailOQC(model), info);
  });
  SendEmailNewOQC = createAsyncThunk<boolean, IOQCDesignadaResultado>("Email/SendEmailNewOQC", async (model, info) => {
    return await errorNotification(() => this.service.SendEmailNewOQC(model), info);
  });

  //Modulo de tickets
  SendEmailTicket = createAsyncThunk<boolean, ITickets>("Email/SendEmailTicket", async (model, info) => {
    return await errorNotification(() => this.service.SendEmailTicket(model), info);
  });
  SendEmailStateTicket = createAsyncThunk<boolean, ITickets>("Email/SendEmailStateTicket", async (model, info) => {
    return await errorNotification(() => this.service.SendEmailStateTicket(model), info);
  });
  SendEmailTicketProceso = createAsyncThunk<boolean, ITicketsItemsProcesosResultados>(
    "Email/SendEmailTicketProceso",
    async (model, info) => {
      return await errorNotification(() => this.service.SendEmailTicketProceso(model), info);
    }
  );
  //Modulo de tickets
  SendEmailDotacionVigente = createAsyncThunk<boolean, IPropsSendEmailDotacionVigente>(
    "Email/SendPauseOfPrinter",
    async (model, info) => {
      return await errorNotification(() => this.service.SendEmailDotacionVigente(model), info);
    }
  );

  SendMailAuditoriaSeguridadEHigiene = createAsyncThunk<boolean, number[]>(
    "Email/SendMailAuditoriaSeguridadEHigiene",
    async (model, info) => {
      return await errorNotification(() => this.service.SendMailAuditoriaSeguridadEHigiene(model), info);
    }
  );
}
export const EmailSliceRequest = new emailSlice(emailService);
const initialState = {
  loading: null,
  data: null
};
export const EmailSlice = createSlice({
  name: "Email",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(EmailSliceRequest.EmailAuditoria.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailAuditoria.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailProductoTerminado.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailProductoTerminado.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.SendEmailAuditTrackingEmailGroup.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.SendEmailAuditTrackingEmailGroup.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailRechazos.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailRechazos.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailCierreLote.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailCierreLote.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailCierreLoteCondicional.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailCierreLoteCondicional.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailCierreLoteGerencia.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailCierreLoteGerencia.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterialesAdministracion.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterialesAdministracion.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterial.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterial.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterialCalidad.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailPedidoMaterialCalidad.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.PautaIngenieriaAprobadaCambioVersionEmail.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.PautaIngenieriaAprobadaCambioVersionEmail.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailAprobacionPlanos.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailAprobacionPlanos.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailHojaDeParametros.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.EmailHojaDeParametros.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.EmailPlanificacionContenedores.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(EmailSliceRequest.SendEmailNewOQC.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.SendEmailNewOQC.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(EmailSliceRequest.SendMailAuditoriaSeguridadEHigiene.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(EmailSliceRequest.SendMailAuditoriaSeguridadEHigiene.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
