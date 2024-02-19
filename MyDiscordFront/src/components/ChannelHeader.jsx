import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import PropTypes from "prop-types";
import ChannelImage from "./icones/ChannelImage";
import { UserPlus, XCircle, Edit } from "lucide-react";
import DeleteModal from "./modal/DeleteModal";
import AddUserModal from "./modal/AddUserModal";
import channelService from "../service/channel.service";
import userChannelService from "../service/user-channel.service";
import { toast } from "react-toastify";
import "./ChannelHeader.css";

const ChannelHeader = ({ channel }) => {
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(channel.name);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setEditedName(channel.name);
  }, [channel]);

  const handleDelete = () => {
    if (channel.category !== "public") {
      console.log("delete private channel");
      channelService.deleteChannel(channel.id);
      return;
    } else {
      const userChannel = userChannelService.getUserChannelByUserIdAndChannelId(
        user?.id,
        channel?.id
      );
      if (userChannel.isAdmin) {
        console.log("delete public channel");
        channelService.deleteChannel(channel.id);
      } else {
        toast.error("Vous n'avez pas les droits pour supprimer ce salon");
      }
    }
  };

  const handleAddUser = async (newUser) => {
    if (channel.category === "private") {
      const userChannelData = {
        idAccount: newUser.value,
        idChannel: channel.id,
        nickname: newUser.label,
        connectedAt: new Date(),
      };
      await userChannelService.createUserChannel(userChannelData);

      await channelService.updateChannel(channel.id, {
        category: "group",
      });
    } else {
      const userChannelData = {
        idAccount: newUser.value,
        idChannel: channel.id,
        nickname: newUser.label,
        connectedAt: new Date(),
      };
      await userChannelService.createUserChannel(userChannelData);
    }
  };

  const handleEdit = async (event) => {
    if (event.key === "Enter") {
      await channelService.updateChannel(channel.id, { name: editedName });
      setIsEditing(false);
    }
  };

  return (
    <div className="channelheader_container">
      <div className="channelheader_img">
        <ChannelImage src={channel.image} />
      </div>
      <div className="channelheader_info_container">
        {isEditing ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyPress={handleEdit}
          />
        ) : (
          <span className="channelheader_info">
            {editedName.substring(0, 40) +
              (editedName.length > 40 ? "..." : "")}
          </span>
        )}
      </div>
      <div className="channelheader_button_container">
        <div
          data-tooltip-content="Modifier le nom du canal"
          data-tooltip-id={"react-tooltip"}
          className="channelheader_icons"
          onClick={() => setIsEditing(true)}
        >
          <Edit size={20} strokeWidth={2} stroke="#765EFF" />
        </div>
        <div
          data-tooltip-content="Ajouter un membre"
          data-tooltip-id={"react-tooltip"}
          className="channelheader_icons"
          onClick={() => setAddUserModalVisible(true)}
        >
          <UserPlus size={20} strokeWidth={2} stroke="#765EFF" />
        </div>
        <div
          data-tooltip-content="Supprimer le groupe"
          data-tooltip-id={"react-tooltip"}
          className="channelheader_icons"
          onClick={() => setDeleteModalVisible(true)}
        >
          <XCircle size={20} strokeWidth={2} stroke="#FF4200" />
        </div>
      </div>
      <DeleteModal
        show={deleteModalVisible}
        toggleModal={() => setDeleteModalVisible(false)}
        handleDelete={handleDelete}
      />
      <AddUserModal
        show={addUserModalVisible}
        channel={channel}
        toggleModal={() => setAddUserModalVisible(false)}
        handleAddUser={handleAddUser}
      />
    </div>
  );
};

ChannelHeader.propTypes = {
  channel: PropTypes.object.isRequired,
};

export default ChannelHeader;
