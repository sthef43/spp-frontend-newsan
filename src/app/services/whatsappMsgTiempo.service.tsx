import { GenericService } from "./generic.service";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";

export class WhatsappMsgTiempoService extends GenericService<IWhatsappMsgTiempo> {
  Url = "WhatsappMsgTiempo";
  constructor() {
    super("WhatsappMsgTiempo");
  }
}
