import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
import { GenericService } from "app/services/generic.service";

export class WhatsappMsgTiempoService extends GenericService<IWhatsappMsgTiempo> {
  Url = "WhatsappMsgTiempo";
  constructor() {
    super("WhatsappMsgTiempo");
  }
}
