import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../auth/styles/AuthStyle.css';

const NotImplementedPage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count <= 0) {
            navigate('/home/user/HomePage');
            return;
        }
        const id = setTimeout(() => setCount(c => c - 1), 1000);
        return () => clearTimeout(id);
    }, [count, navigate]);

    return (
        <div className="layout">
            <div className="main-container">
                <div className="content-container">
                    <div className="auth-container">
                        <div className="not-implemented-box">
                            <h2 className="not-implemented-title">Não implementado ainda</h2>
                            <p className="not-implemented-desc">Esta funcionalidade ainda não foi implementada.</p>
                            <div className="not-implemented-count">Redirecionando em {count}s</div>
                            <div className="not-implemented-actions">
                                <button className="secondary-button" onClick={() => navigate('/home/user/HomePage')}>Ir agora</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotImplementedPage;
