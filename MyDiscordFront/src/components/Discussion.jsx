import React, { useState, useEffect, useContext } from "react";
import { formatDistanceToNow, set } from "date-fns";
import { fr } from "date-fns/locale";
import { FormatDateMessage } from "../utils/FormatDateMessage.utils";
import { ChannelContext } from '../context/ChannelContext';
import { LockIcon, UsersRound } from 'lucide-react';
import './Discussion.css';

const Discussion = ({ setCurrentChannel, currentChannel, searchFilter }) => {
  const [mergedChannels, setMergedChannels] = useState([]);
  const { groupChannels, privateChannels } = useContext(ChannelContext);
  const [filteredChannels, setFilteredChannels] = useState([]);

  useEffect(() => {
    setMergedChannels(() => [...groupChannels, ...privateChannels]);
  }, [groupChannels, privateChannels]);
  
  useEffect(() => {
    setFilteredChannels(() => mergedChannels.filter(channel => channel.name.toLowerCase().includes(searchFilter.toLowerCase())));
  }, [mergedChannels, searchFilter]);

  return (
    <div className="discussion_container">
      {filteredChannels.map((channel, index) => (
        <button
          key={index}
          onClick={() => setCurrentChannel(channel)}
          className={
            currentChannel?.id === channel.id ? `discussion_channel_selected`: ""
          }
        >
          <div className="discussion_channel_container">
            <img
              src={channel.picture || "https://via.placeholder.com/150"}
              alt="Group"
              className="discussion_icon"
            />
            <div className="discussion_channel_container_sub">
              <div className="discussion_channel_name">
                {channel.name.substring(0, 25) + (channel.name.length > 25 ? '...' : '')}
              </div>
              <div className="discussion_channel_category_container">
                {channel.category && channel.category === "private" ? (
                  <>
                    <div className="discussion_channel_category_container_sub">
                      <LockIcon
                        size={16}
                        strokeWidth={2}
                      />
                      <span>Conversation privée</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="discussion_channel_category_container_sub">
                      <UsersRound
                        size={16}
                        strokeWidth={2}
                      />
                      <span>Groupe privée</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="discussion_channel_time">
              {FormatDateMessage(
                formatDistanceToNow(channel.updatedAt, {
                  addSuffix: true,
                  locale: fr,
                })
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Discussion;
