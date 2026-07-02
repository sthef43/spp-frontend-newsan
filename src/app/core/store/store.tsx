import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import thunk from "redux-thunk";
import { rootReducer } from "../../Middleware/reducers/rootReducer";

//const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== "production",
  middleware: getDefaultMiddleware({
    serializableCheck: false
  }).concat(thunk)
  //    composeEnhancers(applyMiddleware(thunk))
});

// Infer the `RootState` and `AppDispatch` types from the store itself|
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
