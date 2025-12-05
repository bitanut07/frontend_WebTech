import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, setCurrentUser, removeCurrentUser } from '../utils/localStorage.js';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: getCurrentUser(),
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            success: false,
        },
        logout: {
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.currentUser = action.payload;
            setCurrentUser(action.payload);
            state.login.isFetching = false;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.success = true;
            state.register.isFetching = false;
            state.register.error = false;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.logout.success = true;
            state.logout.isFetching = false;
            state.logout.error = false;
            state.login.currentUser = null;
            removeCurrentUser(); 
        },
        logoutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerFailed,
    registerSuccess,
    logoutFailed,
    logoutStart,
    logoutSuccess,
} = authSlice.actions;
export default authSlice.reducer;
