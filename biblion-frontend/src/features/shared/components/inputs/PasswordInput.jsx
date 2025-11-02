import React, {useState} from 'react';
import './InputsStyle.css';
import './PasswordInput.css';

import openEyeIcon from "../../../../assets/icons/eye-open-icon.svg";
import closedEyeIcon from "../../../../assets/icons/eye-closed-icon.svg";

const PasswordInput = ({label, value, onChange, isRequired}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="password-container">
            <div className="password-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    maxLength="255"
                    autoComplete="off"
                    value={value}
                    placeholder="Digite sua senha"
                    onChange={onChange}
                    className="input-field"
                    required={isRequired}
                />

                <img
                    src={showPassword ? openEyeIcon : closedEyeIcon}
                    alt="toggle password visiblity"
                    className="eye-icon"
                    onClick={toggleVisibility}
                />
            </div>
        </div>
    );
};
export default PasswordInput;