import Modal from "./Modal";
import ProtoTypes from "prop-types";
import channelService from "../../service/channel.service";
import userChannelService from "../../service/user-channel.service";
import { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import ServersListJoin from "../ServersListJoin";
import { UserContext } from "../../context/UserContext";
import './SearchServerModal.css';

const SearchServerModal = ({ show, toggleModal }) => {
  const [servers, setServers] = useState([]);
  const [myServers, setMyServers] = useState([]);
  const [serverToJoin, setServerToJoin] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchChannels = async () => {
      const response = await channelService.getChannels({
        type: ["public"],
      });
      setServers(response.data);

      const userChannelsResponse = await userChannelService.getChannelsByUserId(
        user?.id,
        {
          type: ["public"],
        }
      );
      setMyServers(userChannelsResponse.data);

      setServerToJoin(
        response.data.filter(
          (server) =>
            !userChannelsResponse.data.some(
              (myServer) => myServer.id === server.id
            )
        )
      );
    };

    fetchChannels();
  }, []);

  return (
    <Modal show={show} toggleModal={toggleModal}>
      <div className="searchservermodal_container">
        <div className="searchservermodal_header">
          <h2>Rejoindre un nouveau serveur</h2>
          <button onClick={toggleModal}>
            <X />
          </button>
        </div>
        <hr />
        <div>
          <div className="searchservermodal_servercontainer">
            <div className="searchservermodal_serverlist">
              {serverToJoin.length === 0 ? (
                <div>Aucun serveur à rejoindre</div>
              ) : (
                serverToJoin.map((server, index) => (
                  <ServersListJoin server={server} toggleModal={toggleModal} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

SearchServerModal.propTypes = {
  show: ProtoTypes.bool.isRequired,
  toggleModal: ProtoTypes.func.isRequired,
};

export default SearchServerModal;
