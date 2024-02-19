import { useState, useContext } from "react";
import { Plus, Search, User } from "lucide-react";
import ServerModal from "./modal/ServerModal";
import SearchServerModal from "./modal/SearchServerModal";
import { UserContext } from "../context/UserContext";
import { ChannelContext } from '../context/ChannelContext';
import './ServerList.css';
import { NavigateContext } from '../context/NavigateContext';

const ServerList = ({setCurrentChannel, currentChannel}) => {
  const [showServerModal, setShowServerModal] = useState(false);
  const [showSearchServerModal, setShowSearchServerModal] = useState(false);
  const { user } = useContext(UserContext);
  const { publicChannels: servers } = useContext(ChannelContext);
  const { setRoute } = useContext(NavigateContext);

  const toggleServerModal = () => {
    setShowServerModal((show) => !show);
  };

  const toggleSearchServerModal = () => {
    setShowSearchServerModal((show) => !show);
  };

  return (
    <>
      <div className='serverlist_servers_container'>
        {servers.map((server, index) => (
          <button
            key={index}
            data-tooltip-content={server.name}
            data-tooltip-id={"react-tooltip"}
            onClick={() => {
              setCurrentChannel(server);
              setRoute('home');
            }}
            className={currentChannel?.id === server.id && 'serverlist_active_server'}
          >
            <img
              src={server?.picture || "https://via.placeholder.com/150"}
              alt="Server"
              className='serverlist_active_server_img'
            />
          </button>
        ))}
      </div>
      <div className="serverlist_buttons_sub">
        <div
          data-tooltip-content={"Créer un serveur"}
          data-tooltip-id={"react-tooltip"}
          className="serverlist_buttons_sub_div"
          onClick={toggleServerModal}
        >
          <Plus size={16} strokeWidth={2} className="serverlist_icon" />
        </div>
        <div
          data-tooltip-content={"Rechercher un serveur"}
          data-tooltip-id={"react-tooltip"}
          className="serverlist_buttons_sub_div"
          onClick={toggleSearchServerModal}
        >
          <Search size={16} strokeWidth={2} className="serverlist_icon" />
        </div>
        <div className="serverlist_buttons_sub_div_sb">
          <button
            data-tooltip-content={`Profil de ${user?.nickname || "Anonyme"}`}
            data-tooltip-id={"react-tooltip"}
            onClick={() => setRoute('profile')}
            className="serverlist_buttons_sub_div"
          >
            <User size={16} strokeWidth={2} className="serverlist_icon" />
          </button>
        </div>
      </div>
      <ServerModal show={showServerModal} toggleModal={toggleServerModal} />
      <SearchServerModal
        show={showSearchServerModal}
        toggleModal={toggleSearchServerModal}
      />
    </>
  );
};

export default ServerList;
