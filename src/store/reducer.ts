import {createSlice} from '@reduxjs/toolkit';
import InitState from './initState.js';

const mainSlice = createSlice({
    name: 'main',
    initialState: InitState,
    reducers: {
        saveAccount(state, action) {
            state.account = action.payload;
        },

    },
});

export const {
    saveAccount,

} = mainSlice.actions;
export default mainSlice.reducer;
