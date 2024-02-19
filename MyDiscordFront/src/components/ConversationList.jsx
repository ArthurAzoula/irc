import { useState } from "react";
import { SquarePen } from "lucide-react";
import SearchInput from "./SearchInput";
import GroupModal from "./modal/GroupModal";
import Discussion from "./Discussion";
import './ConversationList.css'

const ConversationList = ({setCurrentChannel, currentChannel}) => {
  const [showModalGroup, setShowGroupModal] = useState(false);
  const [search, setSearch] = useState("");

  const toggleGroupModal = () => {
    setShowGroupModal((show) => !show);
  };

  return (
    <div className="conversationlist_container">
      <div className="conversationlist_container_sub">
        <div className="conversationlist_header">
          <h3>Discussions</h3>
          <button
            data-tooltip-content={`Créer un groupe de discussion`}
            data-tooltip-id={"react-tooltip"}
            onClick={toggleGroupModal}
          >
            <SquarePen size={16} strokeWidth={2} className="conversationlist_header_button_icon" />
          </button>
        </div>
        <SearchInput
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          placeholder="Rechercher un groupe ou une conversation"
        />
      </div>
      <GroupModal show={showModalGroup} toggleModal={toggleGroupModal} />
      <Discussion setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} searchFilter={search}/>
    </div>
  );
};

export default ConversationList;
