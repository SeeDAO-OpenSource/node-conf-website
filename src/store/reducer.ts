import {createSlice} from '@reduxjs/toolkit';
import InitState from './initState.js';

const mainSlice = createSlice({
    name: 'main',
    initialState: InitState,
    reducers: {
        saveAccount(state, action) {
            state.account = action.payload;
        },
        saveSnsMap(state, action) {
            state.snsMap = action.payload;
        }

    },
});

export const {
    saveAccount,
    saveSnsMap,
} = mainSlice.actions;
export default mainSlice.reducer;
