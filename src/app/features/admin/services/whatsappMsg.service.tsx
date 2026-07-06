import { GenericService } from "./generic.service";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import axios from "axios";

export class WhatsappMsgService extends GenericService<IWhatsappMsg> {
  Url = "WhatsappMsg";
  constructor() {
    super("WhatsappMsg");
  }

  public async GetAllByWhatsapAsignacionId(asignacionId: number): Promise<IWhatsappMsg[]> {
    return new Promise<IWhatsappMsg[]>((resolve, reject) => {
      axios
        .get<IWhatsappMsg[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByWhatsapAsignacionId/${asignacionId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}
