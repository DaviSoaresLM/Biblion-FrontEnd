import {useState, useMemo} from "react";

const lowerCaseRegex = /[a-z]/;
const upperCaseRegex = /[A-Z]/;
const numberRegex = /[0-9]/;

export function usePasswordValidator() {
    const [password, setPassword] = useState('');

    const validation = useMemo(() => {
        if (!password) {
            return {
                hasLowerCase: false,
                hasUpperCase: false,
                hasNumber: false,
                isValidLength: false,
                isValid: false,
            };
        }

        const hasLowerCase = lowerCaseRegex.test(password);
        const hasUpperCase = upperCaseRegex.test(password);
        const hasNumber = numberRegex.test(password);
        const isValidLength = password.length >= 8;

        const isValid = hasLowerCase && hasUpperCase && hasNumber;

        return {
            hasLowerCase,
            hasUpperCase,
            hasNumber,
            isValidLength,
            isValid,
        };
    }, [password]);

    const handlePasswordChange = (e) => setPassword(e.target.value);

    return {
        password,
        handlePasswordChange,
        validation,
    };
}