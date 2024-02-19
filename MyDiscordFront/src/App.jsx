// import { useContext, useEffect, useState } from 'react'
// import { SocketContext } from './context/SocketContext';
import Router from './routes/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
import './App.css';

function App() {
  return (
    <>
        <Router />
        <Tooltip id="react-tooltip" className='tooltip'/>
    </>
  )
}

export default App
