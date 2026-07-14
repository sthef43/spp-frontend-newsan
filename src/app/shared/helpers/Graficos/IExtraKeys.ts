export interface IExtraKeys<T> {
  title?: string;
  objectDate: Extract<keyof T, string>;
  render?: () => JSX.Element;
}
