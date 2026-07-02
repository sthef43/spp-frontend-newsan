import { IDobProdDeclaracion } from "app/models/IDobProdDeclaracion";
import { GenericService } from "./generic.service";
import { IDobMovimientosDeclaracion } from "app/models/IDobMovimientosDeclaracion";
import axios from "axios";

export class DobProdDeclaracionService extends GenericService<IDobProdDeclaracion>{
  Url="DobProdDeclaracion";
  constructor(){
    super("DobProdDeclaracion");
  }


  public AddDeclaracionAndUpdateTotal(mov:IDobMovimientosDeclaracion):Promise<boolean>{
    return new Promise((resolve,reject) => {
      axios.post<boolean>(
        `${process.env.REACT_APP_API_URL}/${this.Url}/AddDeclaracionAndUpdateTotal/`,mov
      )
      .then(function (response){
        resolve(response.data);
      })
      .catch( function(err){
        reject(err);
      });
    });
  }
}