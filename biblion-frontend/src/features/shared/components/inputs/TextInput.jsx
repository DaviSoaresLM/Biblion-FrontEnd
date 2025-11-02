import React from 'react';
import './InputsStyle.css';

const TextInput = ({type, label, value, placeholder, onChange, isRequired}) => {
    return (
        <div className="field-container">
            <input
                name={type}
                type={type}
                maxLength="255"
                autoComplete="off"
                className="input-field"
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={isRequired}
            />
        </div>
    );
};
export default TextInput;