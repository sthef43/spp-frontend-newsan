import { GenericService } from "app/services/generic.service";
import axios from "axios";
import { ITicketsMailGroup } from "app/features/tickets/models/ITicketsMailGroup";

export class TicketsMailGroupService extends GenericService<ITicketsMailGroup> {
  Url = "TicketsMailGroup";
  constructor() {
    super("TicketsMailGroup");
  }

  public async GetAllMailByGrupoId(categoriaid: number): Promise<ITicketsMailGroup[]> {
    return new Promise<ITicketsMailGroup[]>((resolve, reject) => {
      axios
        .get<ITicketsMailGroup[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllMailByGrupoId/${categoriaid}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async AddNewEmail(email: ITicketsMailGroup): Promise<ITicketsMailGroup> {
    return new Promise<ITicketsMailGroup>((resolve, reject) => {
      axios
        .post<ITicketsMailGroup>(`${import.meta.env.VITE_API_URL}/${this.Url}/AddNewEmail`, email)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async DeleteEmailById(emailId: number): Promise<ITicketsMailGroup> {
    return new Promise<ITicketsMailGroup>((resolve, reject) => {
      axios
        .delete<ITicketsMailGroup>(`${import.meta.env.VITE_API_URL}/${this.Url}/DeleteEmailById/${emailId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
