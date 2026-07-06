import { ITodo } from "app/models/ITodo";
import { ITodoToday } from "app/models/ITodoToday";
import axios from "axios";
import { GenericService } from "./generic.service";

export class TodoService extends GenericService<ITodo> {
  Url = "Todo";
  constructor() {
    super("Todo");
  }
  public getTodoToday(rolId: number, subRolId: number, turnoId: number, plantId: number): Promise<ITodoToday[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITodoToday[]>(
          `${import.meta.env.VITE_API_URL}/${this.Url}/TodoToday/${rolId}/${subRolId}/${turnoId}/${plantId}`
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  public GetAllByPlantIdAndRol(rolId: number, plantId: number): Promise<ITodo[]> {
    return new Promise((resolve, reject) => {
      axios
        .get<ITodo[]>(`${import.meta.env.VITE_API_URL}/${this.Url}/GetAllByPlantIdAndRol/${rolId}/${plantId}`)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}
