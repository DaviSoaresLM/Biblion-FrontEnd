import {useEffect} from "react";
import './AlertMessage.css';

const AlertMessage = ({message, type, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 6000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`alert-message ${type}`}>
            {message}
        </div>
    );
};
export default AlertMessage;