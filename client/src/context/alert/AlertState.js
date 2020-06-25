import React, { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import AlertContext from './alertContext';
import AlertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';
// useReducer to dispatch to our reducer

const AlertState = (props) => {
  const initalState = [];
  //   array of objects

  const [state, dispatch] = useReducer(AlertReducer, initalState);

  //   Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = uuid();
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };
  return (
    //   return our provider, so that we can wrap our entire application with this context
    <AlertContext.Provider
      value={{
        alerts: state, // because our state is the array
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
