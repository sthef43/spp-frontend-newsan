import { IAppUser } from "app/models";
import { IWhatsappMsgAppUser } from "app/models/IIWhatsappMsgAppUser";
import axios from "axios";
import { GenericService } from "./generic.service";

export class WhatsappMsgAppUserService extends GenericService<IWhatsappMsgAppUser> {
  Url = "WhatsappMsgAppUser";
  constructor() {
    super("WhatsappMsgAppUser");
  }

  public async GetAllByOpcionAsign(opcionId: number, whatsappMsgId: number): Promise<IWhatsappMsgAppUser[]> {
    return new Promise<IWhatsappMsgAppUser[]>((resolve, reject) => {
      axios
        .get<IWhatsappMsgAppUser[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByOpcionAsign/${opcionId}/${whatsappMsgId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }

  public async GetAllUsersWithNoAssigment(opcionId: number, whatsappMsgId: number, plantId: number): Promise<IAppUser[]> {
    return new Promise<IAppUser[]>((resolve, reject) => {
      axios
        .get<IAppUser[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllUsersWithNoAssigment/${opcionId}/${whatsappMsgId}/${plantId}`)
        .then((response) => { resolve(response.data) })
        .catch((error) => { reject(error) })
    })
  }
}
