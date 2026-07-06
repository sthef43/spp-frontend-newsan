import { SubirImagenesAuditHistoricoDTO } from "app/models/DTO/SubirImagenesAuditHistoricoDTO";
import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IAuditImagenesHistorico } from "app/models/IAuditImagenesHistorico";

export class AuditImagenesHistoricoService extends GenericService<IAuditImagenesHistorico> {
  Url = "AuditImagenesHistorico";
  constructor() {
    super("AuditImagenesHistorico");
  }

  public async UploadMultiImages(model: SubirImagenesAuditHistoricoDTO): Promise<boolean> {
    const bodyFormData = new FormData()
    bodyFormData.append("auditHistoricoId", model.auditHistoricoId.toString())
    model.listaImagenes.forEach(elementos => { bodyFormData.append('listaImagenes', elementos) })
    return new Promise<boolean>((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadMultiImages`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}