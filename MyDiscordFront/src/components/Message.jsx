import { useState, useEffect, useContext, useRef } from "react";
import InputSendMessageComponent from "./input/InputSendMessageComponent";
import { SocketContext } from "../context/SocketContext";
import { UserContext } from "../context/UserContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { FormatDateMessage } from "../utils/FormatDateMessage.utils";
import ChannelHeader from "./ChannelHeader";
import PropTypes from "prop-types";
import channelService from "../service/channel.service";
import "./Message.css";
import userChannelService from "../service/user-channel.service";
import { PREFIX, COMMANDS } from "../constants/commands.constants";
import { ServerIcon } from "lucide-react";

const Message = ({ currentChannel }) => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const { socket } = useContext(SocketContext);
  const { user: currentUser } = useContext(UserContext);
  const [messageInput, setMessageInput] = useState("");
  const [currentUserChannel, setCurrentUserChannel] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUserChannel = async () => {
      if (user && user.id && currentChannel.id) {
        try {
          const response =
            await userChannelService.getUserChannelByUserIdAndChannelId(
              user.id,
              currentChannel.id
            );
          if (response.status === 200) {
            setCurrentUserChannel(response.data);
          } else {
            console.error(response.data);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("No user or channel id");
        setCurrentUserChannel({});
      }
    };

    fetchUserChannel();
  }, [user, currentChannel]);

  const handleSendMessage = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const messageValue = formData.get("message");

    if (messageValue.startsWith(PREFIX)) {
      handleCommand(messageValue);
      setMessageInput("");
      return;
    }

    setMessageInput("");

    socket.emit("message", {
      channelId: currentChannel?.id,
      message: messageValue,
    });
  };

  const handleCommand = (messageValue) => {
    const [command, ...args] = messageValue.slice(0).split(" ");

    switch (command) {
      // Inside your handleCommand function
      case COMMANDS.CHANGE_NICKNAME: {
        const newNickname = args.join(" ");
        userChannelService
          .updateUserNickname(currentUserChannel?.id, newNickname)
          .then((response) => {
            if (response.status === 200) {
              // Update the user's nickname in the UI only for the current channel
              const updatedMessages = messages.map((message) => {
                if (
                  message.userChannel &&
                  message.userChannel.account &&
                  message.userChannel.account.id === currentUser.id &&
                  message.userChannel.idChannel === currentChannel.id
                ) {
                  message.userChannel.account.nickname = newNickname;
                }
                return message;
              });
              setMessages(updatedMessages);

              // Emit the nicknameChanged event to the server
              socket.emit("nicknameChanged", {
                channelId: currentChannel?.id,
                message: newNickname,
              });
            } else {
              // Handle error from the server
              console.error(response.data);
            }
          })
          .catch((error) => {
            // Handle network errors
            console.error(error);
          });
        break;
      }

      case COMMANDS.LIST_USERS:
        socket.emit("users", { channelId: currentChannel?.id });
        break;

      case COMMANDS.LIST_CHANNELS:
        const searchString = args.join(" ");
        socket.emit("listChannels", { channelName: searchString });
        break;

      case COMMANDS.CREATE_CHANNEL:
        const channelToCreate = args.join(" ");
        socket.emit("createChannel", {
          name: channelToCreate,
          category: "public",
        });
        break;

      case COMMANDS.DELETE_CHANNEL:
        const channelToDelete = args.join(" ");
        socket.emit("deleteChannel", { name: channelToDelete });
        break;

      case COMMANDS.JOIN_CHANNEL:
        const channelToJoin = args.join(" ");
        socket.emit("joinChannel", { name: channelToJoin });
        break;

      case COMMANDS.LEAVE_CHANNEL:
        const channelToLeave = args.join(" ");
        socket.emit("leaveChannel", { name: channelToLeave });
        break;

      case COMMANDS.SEND_PRIVATE_MESSAGE:
        // like : /msg nickname message
        const [nickname, ...privateMessage] = args;
        console.log(nickname, privateMessage);
        socket.emit("sendPrivateMessage", {
          nickname,
          message: privateMessage.join(" "),
          idChannel: currentChannel?.id,
        });

        break;

      default:
        socket.emit("unknow", {
          channelId: currentChannel?.id,
          message: "Commande inconnue !",
        });
        break;
    }
  };

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((messages) => [...messages, message]);
    };

    const handleUpdateNickname = (nicknameChangeMessage) => {
      const match = nicknameChangeMessage.match(
        /L'utilisateur (.+) a changé son pseudo en (.+)/
      );

      if (match && match.length === 3) {
        const userChanged = match[1];
        const newNickname = match[2];

        const systemMessage = {
          systemMessage: true,
          content: `${userChanged} a changé son pseudo en ${newNickname}`,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      }
    };

    const handleListUsers = (obj) => {
      if (obj.users && Array.isArray(obj.users)) {
        const systemMessage = {
          systemMessage: true,
          content: `${
            obj.users.length
          } Utilisateurs dans ce channel : ${obj.users.join(", ")}`,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      } else {
        console.error("users is not an array or does not exist");
      }
    };

    const handleListChannels = (obj) => {
      if (obj.channels && Array.isArray(obj.channels)) {
        const systemMessage = {
          systemMessage: true,
          content: `${obj.channels.length} Channels trouvés : ${obj.channels
            .map((channel) => channel.name)
            .join(", ")}`,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      } else {
        console.error("channels is not an array or does not exist");
      }
    };

    const handleCreateChannel = (obj) => {
      if (obj.channel) {
        const systemMessage = {
          systemMessage: true,
          content: `Le channel ${obj.channel.name} a été créé avec succès`,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      } else {
        console.error("channel does not exist");
      }
    };

    const handleLeaveChannel = (data) => {
      if (data.error) {
        const errorMessage = {
          systemMessage: true,
          content: data.error,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, errorMessage]);
      } else if (data.message) {
        const systemMessage = {
          systemMessage: true,
          content: data.message,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      }
    };

    const handleJoinChannel = (data) => {
      if (data.error) {
        const errorMessage = {
          systemMessage: true,
          content: data.error,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, errorMessage]);
      } else if (data.message) {
        const systemMessage = {
          systemMessage: true,
          content: data.message,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      }
    };

    const handleDeleteChannel = (data) => {
      if (data.error) {
        const errorMessage = {
          systemMessage: true,
          content: data.error,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, errorMessage]);
      } else if (data.message) {
        const systemMessage = {
          systemMessage: true,
          content: data.message,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      }
    };

    const handleSendPrivateMessage = (data) => {
      if (data.error) {
        const errorMessage = {
          systemMessage: true,
          content: data.error,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, errorMessage]);
      } else if (data.message) {
        const systemMessage = {
          systemMessage: true,
          content: data.message,
          createdAt: new Date(),
        };

        setMessages((messages) => [...messages, systemMessage]);
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("nicknameChanged", handleUpdateNickname);
    socket.on("users", handleListUsers);
    socket.on("listChannels", handleListChannels);
    socket.on("createChannel", handleCreateChannel);
    socket.on("leaveChannel", handleLeaveChannel);
    socket.on("joinChannel", handleJoinChannel);
    socket.on("deleteChannel", handleDeleteChannel);
    socket.on("sendPrivateMessage", handleSendPrivateMessage);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("nicknameChanged", handleUpdateNickname);
      socket.off("users", handleListUsers);
      socket.off("listChannels", handleListChannels);
      socket.off("createChannel", handleCreateChannel);
      socket.off("leaveChannel", handleLeaveChannel);
      socket.off("joinChannel", handleJoinChannel);
      socket.off("deleteChannel", handleDeleteChannel);
      socket.off("sendPrivateMessage", handleSendPrivateMessage);
    };
  }, [user]);

  useEffect(() => {
    if (!currentChannel) {
      setMessages([]);
      return;
    }

    channelService
      .getMessagesByChannelId(currentChannel.id)
      .then((response) => setMessages(response.data));
  }, [currentChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message_container">
      {currentChannel && (
        <div className="message_header">
          <ChannelHeader channel={currentChannel} />
          <hr />
        </div>
      )}
      <div className="message_message_container">
        {currentChannel ? (
          messages?.length === 0 ? (
            <div className="message_no_messages_container_sub">
              <img src="/emptyGif.gif" alt="No messages GIF" />
              <p>Aucun message dans cette discussion</p>
            </div>
          ) : (
            <>
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`message_has_messages_container ${
                    message?.systemMessage
                      ? "message_has_messages_container_center"
                      : (message?.userChannel?.idAccount ||
                          message?.userChannel?.idAnonymous) === currentUser.id
                      ? "message_has_messages_container_end"
                      : "message_has_messages_container_start"
                  }`}
                >
                  {message.systemMessage ? (
                    <div className="message_system_message_container">
                      <div className="message_system_message_container_sub">
                        <ServerIcon size={20} strokeWidth={2} />
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="message_is_message_container">
                      {(message?.userChannel?.idAccount ||
                        message?.userChannel?.idAnonymous) !==
                        currentUser.id && (
                        <img
                          className="message_avatar_img"
                          src={
                            message?.userChannel?.account?.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt="User Avatar"
                        />
                      )}
                      <div
                        className={`message_message_content ${
                          (message?.userChannel?.idAccount ||
                            message?.userChannel?.idAnonymous) ===
                          currentUser?.id
                            ? "message_message_content_self"
                            : ""
                        }`}
                      >
                        <p>{message?.content || message?.message}</p>
                      </div>
                      {(message?.userChannel?.idAccount ||
                        message?.userChannel?.idAnonymous) ===
                        currentUser?.id && (
                        <img
                          className="message_avatar_img"
                          src={
                            message?.userChannel?.account?.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt="User Avatar"
                        />
                      )}
                    </div>
                  )}
                  {message.systemMessage || (
                    <p className="system_message_form">
                      {(message?.userChannel?.idAccount ||
                        message?.userChannel?.idAnonymous) === currentUser.id
                        ? `${message?.userChannel?.nickname} (Vous)`
                        : message?.userChannel?.nickname}{" "}
                      -{" "}
                      {FormatDateMessage(
                        formatDistanceToNow(message.createdAt || new Date() , {
                          addSuffix: true,
                          locale: fr,
                        })
                      )}{" "}
                      à {new Date(message.createdAt).getHours()}:
                      {new Date(message.createdAt)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </p>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </>
          )
        ) : (
          <div className="message_no_discussion_container">
            {messages.some((message) => message.systemMessage) ? (
              messages.map((message) => {
                if (message.systemMessage) {
                  return (
                    <div className="message_system_message_container">
                      <div className="message_system_message_container_sub">
                        <ServerIcon size={20} strokeWidth={2} />
                        <p>{message.content}</p>
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <>
                <img src="/emptyGif.gif" alt="No messages GIF" />
                <p>Aucune discussion sélectionnée</p>
              </>
            )}
          </div>
        )}
      </div>
      <form className="message_form" onSubmit={handleSendMessage}>
        <InputSendMessageComponent
          name="message"
          message="message"
          placeholder="Aa"
          className="message_form_input"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
      </form>
    </div>
  );
};

Message.propTypes = {
  currentChannel: PropTypes.object,
};

export default Message;
