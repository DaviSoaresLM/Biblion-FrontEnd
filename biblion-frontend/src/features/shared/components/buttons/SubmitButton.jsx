import React from "react";
import './SubmitButton.css';

const SubmitButton = ({text, onClick, disabled, type = "button"}) => {
    return (
        <button
            className={`submit-button ${disabled ? "disabled" : ""}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="cta-text">{text}</span>
        </button>
    );
};
export default SubmitButton;