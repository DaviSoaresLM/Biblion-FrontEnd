import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.js';

export const useNavigationActions = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const toLoginWithNext = (path) => navigate(`/auth/login?next=${encodeURIComponent(path)}`);

    const handleMyLibraryClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (isAuthenticated) navigate('/home/user/MyLibraryPage');
        else toLoginWithNext('/home/user/MyLibraryPage');
    };

    const handleWishlistClick = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (isAuthenticated) navigate('/home/user/WishlistPage');
        else toLoginWithNext('/home/user/WishlistPage');
    };

    const handleLogout = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        logout();
        navigate('/auth/login');
    };

    return { handleMyLibraryClick, handleWishlistClick, handleLogout, navigate };
};

export default useNavigationActions;
