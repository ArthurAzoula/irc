import PropTypes from "prop-types";
import './LoginButton.css';

const LoginButton = ({ text, className, onClick }) => {
    return (
        <button type="submit" onClick={onClick} className={"loginbutton " + className}>
            {text}
        </button>
    );
};

LoginButton.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
};

export default LoginButton;
