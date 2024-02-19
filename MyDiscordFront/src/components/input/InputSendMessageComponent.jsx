import PropTypes from "prop-types";
import { PlusCircle, Image, File, Smile } from "lucide-react";
import { useState } from "react";
import Picker from 'emoji-picker-react';
import "./InputSendMessageComponent.css";

const InputSendMessageComponent = ({ type, name, placeholder, className, text, value, onChange }) => {
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setInputValue((prevValue) => prevValue + emojiObject.emoji);
    };

    const handleFileClick = () => {
    };

    const handleImageClick = () => {
    };

    const handleSmileClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    return (
        <div className="inputsendmessagecomponent_container">
            <PlusCircle stroke="#fff" fill="#765EFF" size={32} className="inputsendmessagecomponent_icons" onClick={handleFileClick} />
            <Image stroke="#fff" fill="#765EFF" size={32} className="inputsendmessagecomponent_icons" onClick={handleImageClick} />
            <File stroke="#fff" fill="#765EFF" size={32} className="inputsendmessagecomponent_icons" onClick={handleFileClick} />
            <div className={`${className} inputsendmessagecomponent_inputs`}>
                <input
                    type={type ?? "text"}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`inputsendmessagecomponent_input`}
                />
                <Smile size={24} stroke="#765EFF" className="inputsendmessagecomponent_emoji" onClick={handleSmileClick} />
                {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
            </div>
            {text && <p>{text}</p>}
        </div>
    );
};

InputSendMessageComponent.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    text: PropTypes.string,
};

export default InputSendMessageComponent;
