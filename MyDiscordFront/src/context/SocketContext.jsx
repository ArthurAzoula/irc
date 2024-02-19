import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import { UserContext } from './UserContext';

export const SocketContext = React.createContext();
const socket = io('https://localhost:8083', {
  withCredentials: true,
  autoConnect: false,
});

const SocketContextProvider = ({children}) => {
  const { user } = React.useContext(UserContext);
  
  useEffect(() => {
    socket.connect();
    
    if(!user) {
      socket.disconnect();
    }

    return () => {
      if(!socket.connected)
        return;
      
      socket.disconnect();
    }
  }, [user]);
  
  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

SocketContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketContextProvider;