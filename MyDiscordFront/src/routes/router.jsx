// routes/Router.js
import routes from './config.routes';
import { useContext } from 'react';
import { NavigateContext } from '../context/NavigateContext';

const Router = () => {
  const {route} = useContext(NavigateContext);
  
  return routes[route] ?? routes['home'];
};

export default Router;
