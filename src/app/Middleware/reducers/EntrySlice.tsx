import { IEntry } from "app/models/IEntry";
import { IIniState } from "app/models/IIniState";
import { EntryService } from "app/services/entry.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const entryService = new EntryService();
class entryClassSlice extends GenericSlice<IEntry> {
  constructor(private service: EntryService) {
    super("Entry", service);
  }
  //nuevos asyncthunks aqui
}
export const EntrySliceRequests = new entryClassSlice(entryService);

const initialState: IIniState<IEntry> = {
  loading: null,
  data: null
};

export const entrySlice = createSlice({
  name: "Entry",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EntrySliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
