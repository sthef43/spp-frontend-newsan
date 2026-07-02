export interface ISPDashboardGetPanelData {
  ProductName: string;
  LineName: string;
  InitialQuantity: number;
  DeclaredQuantity: number;
  ExpectedQuantity: number;
  ShiftDeclaredQuantity: number;
  ShiftExpectedQuantity: number;
  Repaired: number;
  Pending: number;
  minutos: number;
  pintarColor: string;
  fecha: Date;
  turno: string;
  planta: string;
}
