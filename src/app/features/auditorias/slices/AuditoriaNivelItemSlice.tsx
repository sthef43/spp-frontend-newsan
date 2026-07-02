import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaNivelItem } from "../models/IAuditoriaNivelItem";
import { AuditoriaNivelItemService } from "../services/AuditoriaNivelItem.service";

const service = new AuditoriaNivelItemService();

class AuditoriaNivelItemClassSlice extends GenericSlice<IAuditoriaNivelItem> {
  constructor(service: AuditoriaNivelItemService) {
    super("AuditoriaNivelItem", service);
  }
}

export const AuditoriaNivelItemSliceRequest = new AuditoriaNivelItemClassSlice(service);

const initialState: IIniState<IAuditoriaNivelItem> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaNivelItemSlice = createSlice({
  name: "AuditoriaNivelItem",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaNivelItemSliceRequest.builderAll(builder);
  }
});
