import { combineReducers, configureStore } from "@reduxjs/toolkit";

const mainReducer = combineReducers({

});

export const mainStore = configureStore({
    reducer: mainReducer,
})