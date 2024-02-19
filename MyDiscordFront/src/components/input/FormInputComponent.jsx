import PropTypes from "prop-types"
import './FormInputComponent.css'

const FormInputComponent = ({type, name, placeholder, className, text}) => {
    return (
        <>
            <input 
                type={type ?? 'text'} 
                name={name} 
                placeholder={placeholder} 
                className={`${className ?? ''} forminputcomponent_input`}
            >
            </input>
            {text && <p>{text}</p>}
        </>
    );
};

FormInputComponent.propTypes={
    type:PropTypes.node,
    name:PropTypes.node,
    placeholder:PropTypes.node,
    className:PropTypes.node,
    text:PropTypes.node,

}

export default FormInputComponent;