import { AnyAction, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { api } from './services/api.service';

export const combinedReducers = combineReducers({
  [api.reducerPath]: api.reducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => combinedReducers(state, action);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof combinedReducers>;
export default store;
