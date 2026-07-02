import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { DotaSectorService } from "app/services/dotaSector.service";
import { IDotaSector } from "app/models/IDotaSector";

const dotaSectorService = new DotaSectorService();
class dotaSectorClassSlice extends GenericSlice<IDotaSector> {
  constructor(private service: DotaSectorService) {
    super("DotaSector", service);
  }
  //nuevos asyncthunks aqui
}
export const DotaSectorSliceRequests = new dotaSectorClassSlice(dotaSectorService);

const initialState: IIniState<IDotaSector> = {
  loading: null,
  data: null
};

/* export const dobSemiSlice = createSlice({
  name: "DobSemi",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobSemiSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
 */
