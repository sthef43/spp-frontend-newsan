export interface IBaseEntityMes {
  id?: number;
  createdUserId?: number | null;
  createdDateTime?: string | null;
  lastModifiedUserId?: number | null;
  lastModifiedDateTime?: string | null;
  deleted?: boolean;
}
