import Modal from "./Modal";
import ProtoTypes from "prop-types";
import channelService from "../../service/channel.service";
import { X, PlusIcon } from "lucide-react";
import ButtonActionComponent from "../button/ButtonActionComponent";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import './ServerModal.css';

const ServerModal = ({ show, toggleModal }) => {
  
  const { user } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const name = formData.get("name");
  
    const response = await channelService.createChannel({
      name,
      category: "public",
      owner: user,
      members: [],
    });
  
    if (response.status === 201) {
      toggleModal();
    }
  };

  return (
    <Modal show={show} toggleModal={toggleModal}>
      <div className="servermodal_container">
        <div className="servermodal_header">
          <h2>Créer un nouveau serveur</h2>
          <button onClick={toggleModal}>
            <X />
          </button>
        </div>
        <hr />
        <div>
          <form className="servermodal_form" onSubmit={handleSubmit}>
            <div className="servermodal_form_inputs">
              <label htmlFor="serverName">
                Nom du serveur
              </label>
              <input
                type="text"
                name="name"
                id="serverName"
                placeholder="nom du serveur"
              />
            </div>
            <ButtonActionComponent text="Créer" className='servermodal_form_buttonaction' icon={<PlusIcon size={16} strokeWidth={3} />} />
          </form>
        </div>
      </div>
    </Modal>
  );
};

ServerModal.propTypes = {
  show: ProtoTypes.bool.isRequired,
  toggleModal: ProtoTypes.func.isRequired,
};

export default ServerModal;
