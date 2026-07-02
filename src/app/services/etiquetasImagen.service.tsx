import { IEtiquetasImagen } from "app/models/IEtiquetasImagen";
import axios from "axios";
import { GenericService } from "./generic.service";

export class EtiquetasImagenService extends GenericService<IEtiquetasImagen> {
    Url = "EtiquetasImagen";
    constructor() {
        super("EtiquetasImagen");
    }

    Upload(modelo: string, tipoDeEtiqueta: string, imageFile: any) {
        const bodyFormData = new FormData();
        bodyFormData.append("image", imageFile);
        bodyFormData.append("modelo", modelo);
        bodyFormData.append("tipoDeEtiqueta", tipoDeEtiqueta);
        return new Promise((resolve, reject) => {
            axios
                .post(`${import.meta.env.VITE_API_URL}/${this.url}/upload`, bodyFormData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then((data) => resolve(data.data.result))
                .catch((error) => reject(error));
        });
    }
    UploadImagesCalidad(modelo: string, tipoDeEtiqueta: string, codigoEtiqueta: string, imageFile: any) {
        const bodyFormData = new FormData();
        bodyFormData.append("image", imageFile);
        bodyFormData.append("modelo", modelo);
        bodyFormData.append("codigoEtiqueta", codigoEtiqueta);  
        bodyFormData.append("tipoDeEtiqueta", tipoDeEtiqueta);
        return new Promise((resolve, reject) => {
            axios
                .post(`${import.meta.env.VITE_API_URL}/${this.url}/UploadImagesCalidad`, bodyFormData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                .then((data) => resolve(data.data.result))
                .catch((error) => reject(error));
        });
    }
    getByModelo(modelo: string, tipoDeEtiqueta: string) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${import.meta.env.VITE_API_URL}/${this.url}/GetByModelo/${modelo}/${tipoDeEtiqueta}`)
                .then((data) => resolve(data.data))
                .catch((error) => reject(error));
        });
    }
    getByModelAndCodelabel(modelo: string, codigoEtiqueta: string) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${import.meta.env.VITE_API_URL}/${this.url}/GetByModelAndCodelabel/${modelo}/${codigoEtiqueta}`)
                .then((data) => resolve(data.data))
                .catch((error) => reject(error));
        });
    }
    getAllByModelo(modelo: string) {
        return new Promise((resolve, reject) => {
            axios
                .get(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllByModelo/${modelo}`)
                .then((data) => resolve(data.data))
                .catch((error) => reject(error));
        });
    }
    getAllTipoEtiquetas() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllTipoEtiquetas`)
                .then((data) => resolve(data.data))
                .catch((error) => reject(error));
        });
    }
    getAllCodigosEtiquetas() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${import.meta.env.VITE_API_URL}/${this.url}/GetAllCodigosEtiquetas`)
                .then((data) => resolve(data.data))
                .catch((error) => reject(error));
        });
    }
}
