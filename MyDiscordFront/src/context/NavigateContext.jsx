import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';

export const NavigateContext = React.createContext();

const NavigateContextProvider = ({children}) => {
  const [route, setRoute] = useState('login');
  
  return (
    <NavigateContext.Provider value={{route, setRoute}}>{children}</NavigateContext.Provider>
  );
};

NavigateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NavigateContextProvider;