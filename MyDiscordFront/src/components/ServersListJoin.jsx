import { DoorOpen } from "lucide-react";
import ButtonActionComponent from "./button/ButtonActionComponent";
import userChannelService from "../service/user-channel.service";
import { UserContext } from "../context/UserContext";
import { useState, useContext } from "react";
import './ServersListJoin.css';

const ServersListJoin = ({ server, toggleModal }) => {

  const { user, reload } = useContext(UserContext);

  const handleJoin = async () => {

    await reload();

    const channelData = user?.isAnonymous
      ? { idAnonymous: user?.id, idChannel: server?.id, nickname: user?.nickname, connectedAt: new Date() }
      : { idAccount: user?.id, idChannel: server?.id, nickname: user?.nickname, connectedAt: new Date() };
    
    console.log(channelData);

    await userChannelService.createUserChannel(channelData);
    
    toggleModal();
  };

  return (
    <div className="serverslistjoin_container">
      <div>
        <img
          src={server?.icon || "https://via.placeholder.com/150"}
          alt=""
          className="serverslistjoin_container_img"
        />
      </div>
      <div className="serverslistjoin_container_title">
        <h3>{server?.name}</h3>
      </div>
      <div>
        <ButtonActionComponent text="Rejoindre" icon={<DoorOpen size={16} strokeWidth={3} />} onClick={handleJoin} />
      </div>
    </div>
  );
};

export default ServersListJoin;