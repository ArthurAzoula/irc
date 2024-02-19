import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';
import userChannelService from '../service/user-channel.service';
import { SocketContext } from './SocketContext';

export const ChannelContext = React.createContext();

const ChannelContextProvider = ({children}) => {
  const [publicChannels, setPublicChannels] = useState([]);
  const [groupChannels, setGroupChannels] = useState([]);
  const [privateChannels, setPrivateChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState();
  const {user} = useContext(UserContext);
  const {socket} = useContext(SocketContext);
  
  const loadChannels = async (controller) => {
    await userChannelService.getChannelsByUserId(user?.id, {type: ['all']}, controller)
    .then(envelop => {
      const {data} = envelop;
      setPublicChannels(data.filter(channel => channel.category === 'public'));
      setGroupChannels(data.filter(channel => channel.category === 'group'));
      setPrivateChannels(data.filter(channel => channel.category === 'private'));
    });
  };
  
  useEffect(() => {
    const controller = new AbortController();
    
    loadChannels(controller);
    
    socket.on('refreshChannels', loadChannels)
      
    return () => {
      controller.abort();
      socket.off('refreshChannels', loadChannels);
    }
  }, [user]);
  
  useEffect(() => {
    console.log(groupChannels, publicChannels, privateChannels);
  }, [groupChannels, publicChannels, privateChannels])
  
  return (
    <ChannelContext.Provider value={{publicChannels, groupChannels, privateChannels, currentChannel, setCurrentChannel}}>{children}</ChannelContext.Provider>
  );
};

ChannelContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ChannelContextProvider;