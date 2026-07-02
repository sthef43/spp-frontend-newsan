import { IAuditoriaGrupoItems } from "../IAuditoriaGrupoItems";
import { IAuditoriaGrupoItemsResult } from "../IAuditoriaGrupoItemsResult";
import { IAuditoriaListaValores } from "../IAuditoriaListaValores";
import { IAuditoriaValores } from "../IAuditoriaValores";
import { IAuditoriaValoresResult } from "../IAuditoriaValoresResult";

export interface IListaDatosParaAuditorias {
  listaEmails: string;
  listaValores: IAuditoriaValores[];
  listaValoresPreview: IAuditoriaValores[];
  tipoAuditoriaId: number;
  listaValoresPadre: IAuditoriaListaValores;
  bloques: IAuditoriaGrupoItems[] | IAuditoriaGrupoItemsResult[];
  listaValoresResult: IAuditoriaValoresResult[];
  tipoProductoId: number;
}
