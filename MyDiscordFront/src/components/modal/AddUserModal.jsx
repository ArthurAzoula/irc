import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { X } from 'lucide-react';
import accountService from '../../service/account.service';
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/async';
import { UserContext } from '../../context/UserContext';
import userChannelService from '../../service/user-channel.service';
import './AddUserModal.css';

const AddUserModal = ({ show, toggleModal, handleAddUser, channel }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [existingUsers, setExistingUsers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchExistingUsers = async () => {
      const users = await userChannelService.getUserChannelsByChannelId(channel.id);
      setExistingUsers(users.data.map((u) => u.idAccount || u.idAnonymous));
    };

    fetchExistingUsers();
  }, [channel.id]);

  const loadOptions = async (inputValue) => {
    const response = await accountService.getAccounts({ search: inputValue });

    if (response.status === 200) {
      const newUsers = response.data
        .filter((u) => u.id !== user.id && !existingUsers.includes(u.id))
        .map((u) => ({ value: u.id, label: u.nickname }));

      return newUsers;
    }

    return [];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedUser) {
      toast.error('Veuillez sélectionner un utilisateur');
      return;
    }

    handleAddUser(selectedUser);
    toggleModal();
  };

  return (
    <Modal show={show} toggleModal={toggleModal}>
      <div className="addusermodal_container bg-white text-black rounded-lg border p-4 flex flex-col gap-3">
        <div className="addusermodal_header">
          <h2>Ajouter un membre</h2>
          <button onClick={toggleModal}>
            <X />
          </button>
        </div>
        <hr />
        <div>
          <form className="addusermodal_form" onSubmit={handleSubmit}>
            <div className="addusermodal_form">
              <label htmlFor="selectedUser" className="addusermodal_form_label">
                Sélectionner un utilisateur
              </label>
              <AsyncSelect
                defaultOptions
                loadOptions={loadOptions}
                className="addusermodal_input_select"
                onChange={(selectedOption) => setSelectedUser(selectedOption)}
                id="selectedUser"
              />
            </div>
            <div className="addusermodal_form_buttons">
              <button type="submit" className="addusermodal_button_add">
                Ajouter
              </button>
              <button onClick={toggleModal} className="addusermodal_button_cancel">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

AddUserModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  handleAddUser: PropTypes.func.isRequired,
};

export default AddUserModal;
