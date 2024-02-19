import PropTypes from "prop-types";

const SearchIcon = ({className}) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g id="Group 57">
            <circle id="Ellipse 21" cx="5.19355" cy="5.19355" r="4.69355" stroke="#747D99"/>
            <path id="Vector 16" d="M9.25687 8.54964L8.90332 8.19609L8.19621 8.9032L8.54977 9.25675L9.25687 8.54964ZM11.1465 11.8535C11.3418 12.0488 11.6584 12.0488 11.8536 11.8535C12.0489 11.6583 12.0489 11.3417 11.8536 11.1464L11.1465 11.8535ZM8.54977 9.25675L11.1465 11.8535L11.8536 11.1464L9.25687 8.54964L8.54977 9.25675Z" fill="#747D99"/>
            </g>
        </svg>
    );
};

SearchIcon.propTypes = {
    className: PropTypes.string,
};


export default SearchIcon;