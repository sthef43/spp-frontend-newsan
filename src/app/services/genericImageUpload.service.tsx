import axios from "axios";
export class GenericImageUploadService {
  Url = "GenericImageUpload";
  public upload(datos): Promise<string> {
    return new Promise((resolve, reject) => {
      const bodyFormData = new FormData();
      bodyFormData.append("image", datos.file);
      bodyFormData.append("nameFile", datos.nameFile);
      bodyFormData.append("stringConcatenation", datos.stringConcatenation);
      axios
        .post<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadImage`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public uploadServer(datos): Promise<string> {
    return new Promise((resolve, reject) => {
      const bodyFormData = new FormData();
      bodyFormData.append("image", datos.file);
      bodyFormData.append("nameFile", datos.nameFile);
      // bodyFormData.append("stringConcatenation", datos.stringConcatenation);
      axios
        .post<string>(`${import.meta.env.VITE_API_URL}/${this.Url}/UploadImageServer`, bodyFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
