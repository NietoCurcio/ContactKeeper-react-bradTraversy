import React, { useReducer } from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/SetAuthToken';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';
// useReducer to dispatch to our reducer

const AuthState = (props) => {
  const initalState = {
    token: localStorage.getItem('token'),
    //   As we see is vanilla javascript to access our browser localStorage, have a lot infomration in docs
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initalState);

  //   Load User, checking which user is logged in, hit auth to get user data
  const loadUser = async () => {
    // set the token to a global headers
    if (localStorage.getItem('token')) {
      setAuthToken(localStorage.getItem('token'));
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  //   Register User, sign up, get the token
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({ type: REGISTER_SUCCESS, payload: res.data });

      loadUser(); //dispatch allow to us dispatch more than one action
    } catch (err) {
      // the return.stats(400) is here
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.msg });
    }
  };

  //   Login User, log the user  in and get the token
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({ type: LOGIN_SUCCESS, payload: res.data });

      loadUser(); //dispatch allow to us dispatch more than one action
    } catch (err) {
      // the return.stats(400) is here
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.msg });
    }
  };

  //   Logout, destroy the token and clean everything
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  // Clear Errors, clear any errors in the state
  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };

  return (
    //   return our provider, so that we can wrap our entire application with this context
    <AuthContext.Provider
      value={{
        // things we are access in other components
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
