import axios from "axios";
import { IOQCSupervisoresMotorola } from "../../../models/IOQCSupervisoresMotorola";
import { GenericService } from "../../../services/generic.service";

export class OQCSupervisoresMotorolaService extends GenericService<IOQCSupervisoresMotorola> {
  Url = "OQCSupervisoresMotorola";
  constructor() {
    super("OQCSupervisoresMotorola");
  }
  getAllSupervisoresByPlantId(lineaId: number): Promise<IOQCSupervisoresMotorola[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<IOQCSupervisoresMotorola[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetAllSupervisoresByPlantaId/${lineaId}`
        )
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
