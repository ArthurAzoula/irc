import React, { useContext } from 'react';
import MessageCircle from '../icons/chat.icon';
import UsersIcon from '../icons/users.icon';
import Archive from '../icons/archive.icon';
import LineIcon from '../icons/line.icon';
import { MenuIcon } from 'lucide-react';
import ServerList from './ServerList';
import './SideBarMenu.css';
import { NavigateContext } from '../context/NavigateContext';

const SideBarMenu = ({setCurrentChannel, currentChannel, shownSidebar}) => {
  const { setRoute } = useContext(NavigateContext);
  const menuItems = [
    { name: 'Messages', icon: <MessageCircle className='sidebarmenu_container_icon' />, onClick: () => {
      setCurrentChannel(null);
      setRoute('home');
    }}
  ];
  
  return (
    <div className="sidebarmenu_container">
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <button 
              data-tooltip-content={item.name}
              data-tooltip-id={"react-tooltip"}
              onClick={item.onClick}>
              <div>
                {item.icon}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebarmenu_icon_container">
        <LineIcon />
      </div>
      <ServerList setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} />
    </div>
  );
};

export default SideBarMenu;
