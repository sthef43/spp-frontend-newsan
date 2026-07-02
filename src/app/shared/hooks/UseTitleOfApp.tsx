import { useAppDispatch } from "app/core/store/store";
import { TitleOfAppSlice } from "app/Middleware/reducers/TitleOfAppSlice";
interface props {
  func: any;
}
export default function useTitleOfApp() {
  const dispatch = useAppDispatch();
  const TitleChanger = (title: string) => {
    dispatch(TitleOfAppSlice.actions.SetTitleOfApp({ Title: title }));
  };

  return {
    TitleChanger
  };
}
