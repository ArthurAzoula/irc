import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { X } from 'lucide-react';
import './DeleteModal.css';

const DeleteModal = ({ show, toggleModal, handleDelete }) => {
  return (
    <Modal show={show} toggleModal={toggleModal}>
      <div className="deletemodal_container">
        <div className="deletemodal_header_container">
          <h2>Suppression d'un groupe</h2>
          <button onClick={toggleModal}>
            <X />
          </button>
        </div>
        <hr />
        <p className='deletemodal_p'>Êtes-vous sûr de vouloir supprimer ce groupe ?</p>
        <div className="deletemodal_container_sub">
          <button
            onClick={() => {
              handleDelete();
              toggleModal();
            }}
            className="deletemodal_button_delete"
          >
            Supprimer
          </button>
          <button onClick={toggleModal} className="deletemodal_button_cancel">
            Annuler
          </button>
        </div>
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default DeleteModal;
