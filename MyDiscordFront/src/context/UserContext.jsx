import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import authServices from "../service/auth.service";

export const UserContext = React.createContext();

const UserContextProvider = ({children}) => {
  const [user, setUser] = React.useState(null);
  
  const reload = async () => {
    const response = await authServices.getMe();
    if (response.status === 200) {
      setUser(response.data);
    } else {
      setUser(null);
    }
    
    return response;
  }
  
  const login = async ({identifier, password}) => {
    const response = await authServices.login({identifier, password});
    if (response.status === 200) {
      setUser(response.data);
    } else {
      setUser(null);
    }
    
    return response;
  }
  
  const register = async ({firstName, lastName, email, password, nickname}) => {
    const response = await authServices.register({firstName, lastName, email, password, nickname});
    
    return response;
  }

  const loginAsAnonymous = async ({nickname}) => {
    const response = await authServices.loginAsAnonymous({nickname});
    if (response.status === 201) {
      setUser(response.data);
    } else {
      setUser(null);
    }
    
    return response;
  }
  
  const logout = async () => {
    const response = await authServices.logout();
    setUser(null);
    
    return response;
  }
  
  useEffect(() => {
    reload();
  }, []);
  
  useEffect(() => {
    console.log('user:', user);
  }, [user])
  
  return (
    <UserContext.Provider value={{user, login, register, logout, reload, loginAsAnonymous}}>{children}</UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContextProvider;