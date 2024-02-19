import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({show, toggleModal, children}) => {
  
  const cancelClick = (event) => {
    event.stopPropagation();
  }
  
  return (
    <>
      {show &&
        <div className='modal_container'
        // <div className='absolute z-40 top-0 left-0 bg-neutral_black-400 bg-opacity-45 w-full h-full flex justify-center items-center'
        onClick={toggleModal}>
          <div className='modal_md' onClick={cancelClick}>
            {children}
          </div>
        </div>
      }
    </>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;