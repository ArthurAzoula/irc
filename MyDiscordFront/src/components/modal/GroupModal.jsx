import Modal from "./Modal";
import ProtoTypes from "prop-types";
import { X, PlusIcon } from "lucide-react";
import { useContext } from "react";
import accountService from "../../service/account.service";
import channelService from "../../service/channel.service";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/SocketContext";
import AsyncSelect from "react-select/async";
import { UserContext } from "../../context/UserContext";
import ButtonActionComponent from "../button/ButtonActionComponent";
import { useState } from "react";
import './GroupModal.css';

const ConversationModal = ({ show, toggleModal }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const [selectedMembers, setSelectedMembers] = useState([]);


  const loadOptions = async (inputValue) => {
    const response = await accountService.getAccounts({ search: inputValue });
    if (response.status === 200) {
      return response.data
        .filter((u) => u.id != user.id)
        .map((u) => ({ value: u.id, label: u.nickname }));
    }

    return [{ value: 1, label: "test" }];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const members = selectedMembers.map((member) => member.value);
    console.log('selectedMembers:', selectedMembers);

    console.log("members", members);

    const response = await channelService.createChannel({
      owner: user,
      name,
      category: "group",
      members,
    });

    if (response.status === 201) {
      toast.success("Groupe créé avec succès");

      toggleModal();
    } else {
      toast.error("Erreur lors de la création du groupe");
    }
  };

  return (
    <Modal show={show} toggleModal={toggleModal}>
      <div className="groupmodal_container">
        <div className="groupmodal_header">
          <h2>Créer une nouvelle conversation</h2>
          <button onClick={toggleModal}>
            <X />
          </button>
        </div>
        <hr />
        <div>
          <form className="groupmodal_form" onSubmit={handleSubmit}>
            <div className="groupmodal_form_inputs">
              <label htmlFor="groupName">
                Nom du groupe
              </label>
              <input
                type="text"
                name="name"
                id="groupName"
                placeholder="Nom du groupe"
                required
              />
            </div>
            <div className="groupmodal_form_inputs">
              <label htmlFor="groupMembers">
                Membres
              </label>
              <AsyncSelect
                isMulti
                defaultOptions
                loadOptions={loadOptions}
                className="groupmodal_asyncselect"
                name="members"
                onChange={setSelectedMembers}
              />
            </div>
            <div className="groupmodal__form_inputs">
              <label htmlFor="groupImage">
                Image
              </label>
              <input
                type="file"
                name="image"
                id="groupImage"
              />
            </div>
            <ButtonActionComponent text="Créer" className='groupmodal_form_buttonaction' icon={<PlusIcon size={16} strokeWidth={3} />} />
          </form>
        </div>
      </div>
    </Modal>
  );
};

ConversationModal.propTypes = {
  show: ProtoTypes.bool.isRequired,
  toggleModal: ProtoTypes.func.isRequired,
};

export default ConversationModal;
