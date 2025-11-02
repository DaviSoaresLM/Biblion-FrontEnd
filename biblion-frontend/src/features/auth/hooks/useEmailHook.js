import {useState} from "react";

export function useEmailHook() {
    const [email, setEmail] = useState('');
    const handleEmailChange = (e) => setEmail(e.target.value);

    return {
        email,
        handleEmailChange,
    };
}