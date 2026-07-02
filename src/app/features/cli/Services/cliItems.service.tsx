import { GenericService } from "app/services/generic.service";
import { ICLIItems } from "../Models/ICLIItems";
// import axios from "axios";

export class CLIItemsService extends GenericService<ICLIItems> {
  Url = "CLIItems";
  constructor() {
    super("CLIItems");
  }

  // GetAllByContainerId(id: number): Promise<ICLIItems[]> {
  //     return new Promise((resolve, reject) => {
  //         axios
  //             .get<ICLIItems[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByContainerId/${id}`)
  //             .then((resp) => {
  //                 resolve(resp.data)
  //             })
  //             .catch((error) => {
  //                 reject(error)
  //             })
  //     })
  // }
  // GetAllWhitoutContainer(): Promise<ICLIItems[]> {
  //     return new Promise((resolve, reject) => {
  //         axios
  //             .get<ICLIItems[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllWhitoutContainer`)
  //             .then((resp) => {
  //                 resolve(resp.data)
  //             })
  //             .catch((error) => {
  //                 reject(error)
  //             })
  //     })
  // }
}
