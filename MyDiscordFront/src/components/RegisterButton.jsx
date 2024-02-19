import PropTypes from "prop-types";
import './RegisterButton.css';

const RegisterButton = ({ text, onClick, className }) => {
    const handleButtonClick = () => {
        console.log('Bouton cliqué !');
        if (onClick) {
            onClick();
        }
    };

    return (         
        <button onClick={handleButtonClick} type="submit" className={"registerbutton " + className}>
            {text}
        </button>
    );
};

RegisterButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string.isRequired,
};

export default RegisterButton;
