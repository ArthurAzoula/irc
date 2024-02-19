import SearchIcon from '../icons/search.icon';
import PropTypes from "prop-types";
import './SearchInput.css';

const SearchInput = ({ placeholder, onChange, value }) => {
    return (
        <div className='searchinput_container'>
            <SearchIcon className='searchinput_icon'/>
            <input 
                type="text" 
                placeholder={placeholder} 
                onChange={onChange} 
                value={value} 
                className="searchinput_input" 
            />
        </div>
    );
};

SearchInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SearchInput;
