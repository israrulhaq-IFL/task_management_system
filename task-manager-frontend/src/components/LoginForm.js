import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css'; // Ensure this path is correct

const LoginForm = ({ onLogin, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
            
            // Store the token in localStorage
            localStorage.setItem('apiKey', response.data.apiKey);

            // Call the onLogin function if provided
            if (onLogin) {
                onLogin(response.data.apiKey);
            }

            // Redirect to the dashboard or another page
            navigate('/dashboard');
        } catch (error) {
            console.error('There was an error logging in!', error);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
            <Button variant="link" className="register-btn" onClick={handleRegister}>Register</Button>
            <Button variant="link" className="forgot-password-btn" onClick={onForgotPassword}>Forgot Password</Button>
        </Form>
    );
};

export default LoginForm;