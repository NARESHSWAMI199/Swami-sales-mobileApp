import React from 'react';
import { useDispatch } from 'react-redux';
import { onSignIn } from '../redux/actions/userActions';

const LoginScreen = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(onSignIn('email@example.com', 'password123'));
    };

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginScreen;