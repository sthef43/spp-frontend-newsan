import axios from "axios";
import { ICLIContendorItems } from "../Models/ICLIContenedorItems";

export class CLIIContenedorItemsService {
  constructor(public url = "CLIContenedorItems") {}
  getAll(): Promise<ICLIContendorItems[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIContendorItems[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAll`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getById(id: number): Promise<ICLIContendorItems> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetById/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getAllWithItemsId(id: number): Promise<ICLIContendorItems> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllWithItemsId/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getAllWithItemsLpn(lpn: string): Promise<ICLIContendorItems> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllWithItemsLPN/${lpn}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  getByLocalizadorId(id: number): Promise<ICLIContendorItems> {
    return new Promise((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByLocalizadorId/${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  postRequest(entity: ICLIContendorItems): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .post<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  putRequest(entity: ICLIContendorItems): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .put<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteRequest(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete<boolean>(`${import.meta.env.VITE_API_URL}/${this.url}?id=${id}`)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  public async GetByOptionLpn(opcionGenerada: string): Promise<ICLIContendorItems[]> {
    return new Promise<ICLIContendorItems[]>((resolve, reject) => {
      axios
        .get<ICLIContendorItems[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetByOptionLpn/${opcionGenerada}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  PutModel(entity: ICLIContendorItems): Promise<ICLIContendorItems> {
    return new Promise((resolve, reject) => {
      axios
        .put<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/PutModel`, entity)
        .then((resp) => {
          resolve(resp.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  public async GetContainerByLPN(lpnGenerada: string): Promise<ICLIContendorItems> {
    return new Promise<ICLIContendorItems>((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetContainerByLPN/${lpnGenerada}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async GetAllContainersBySectorId(sectorId: number): Promise<ICLIContendorItems[]> {
    return new Promise<ICLIContendorItems[]>((resolve, reject) => {
      axios
        .get<ICLIContendorItems[]>(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllContainersBySectorId/${sectorId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  public async GetContenedorById(id: number): Promise<ICLIContendorItems> {
    return new Promise<ICLIContendorItems>((resolve, reject) => {
      axios
        .get<ICLIContendorItems>(`${import.meta.env.VITE_API_URL}/${this.url}/GetContenedorById/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
