import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import SocketContextProvider from './context/SocketContext.jsx';
import UserContextProvider from './context/UserContext.jsx';
import ChannelContextProvider from './context/ChannelContext.jsx';
import NavigateContextProvider from './context/NavigateContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <SocketContextProvider>
        <ChannelContextProvider>
          <NavigateContextProvider>
            <App />
          </NavigateContextProvider>
        </ChannelContextProvider>
      </SocketContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);