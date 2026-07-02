import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { IDotacionGrupoSectores } from "../models/IDotacionGrupoSectores";

export class DotacionGrupoSectoresService extends GenericService<IDotacionGrupoSectores> {
  Url = "DotacionGrupoSectores";
  constructor() {
    super("DotacionGrupoSectores");
  }

  public async GetGroupsByPlantAndLineId(
    lineaProduccionId: number,
    plantaId: number
  ): Promise<IDotacionGrupoSectores[]> {
    return new Promise<IDotacionGrupoSectores[]>((resolve, reject) => {
      axios
        .get<IDotacionGrupoSectores[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetGroupsByPlantAndLineId/${lineaProduccionId}/${plantaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetAllWithGroup(grupoId: number): Promise<IDotacionGrupoSectores[]> {
    return new Promise<IDotacionGrupoSectores[]>((resolve, reject) => {
      axios
        .get<IDotacionGrupoSectores[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWithGroup/${grupoId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async GetFirstGroupByPlantAndLineId(
    lineaProduccionId: number,
    plantaId: number
  ): Promise<IDotacionGrupoSectores[]> {
    return new Promise<IDotacionGrupoSectores[]>((resolve, reject) => {
      axios
        .get<IDotacionGrupoSectores[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/GetFirstGroupByPlantAndLineId/${lineaProduccionId}/${plantaId}`
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
