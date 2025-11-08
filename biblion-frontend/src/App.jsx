import React from "react";
import {BrowserRouter as Router, Route, Routes, Link, Navigate} from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import AdminLoginPage from "./features/auth/pages/AdminLoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import HomePage from "./features/home/user/pages/HomePage.jsx";
import HomePageAdmin from "./features/home/admin/pages/HomePageAdmin.jsx";
import MyLibraryPage from "./features/personalLibrary/page/MyLibraryPage.jsx";
import WishlistPage from "./features/wishlist/pages/WishlistPage.jsx";
import NotImplementedPage from "./features/shared/pages/NotImplementedPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home/user/HomePage"/>}/>
                <Route path="/home/user/HomePage" element={<HomePage/>}/>
                <Route path="/home/user/HomePageAdmin" element={<HomePageAdmin/>}/>
                <Route path="/home/user/MyLibraryPage" element={<MyLibraryPage/>}/>
                <Route path="/home/user/WishlistPage" element={<WishlistPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/auth/login" element={<LoginPage/>}/>
                <Route path="/admin/login" element={<AdminLoginPage/>}/>
                <Route path="/auth/admin-login" element={<AdminLoginPage/>}/>
                <Route path="/not-implemented" element={<NotImplementedPage/>}/>
                <Route path="/auth/register" element={<RegisterPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </Router>
    );
}
export default App;