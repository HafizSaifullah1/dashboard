import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, message, Card, Typography, Spin } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/configfirebase'
import 'tailwindcss/tailwind.css';

const { Title, Text } = Typography;

function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            message.success('Welcome Admin!');
            setIsAuthenticated(true);
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            message.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {!isAuthenticated ? (
                <Card className="w-full max-w-md shadow-lg rounded-lg p-6">
                    <Title level={3} className="text-center text-blue-600">Admin Login</Title>
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-2"
                        />
                        <Input.Password
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-4"
                        />
                        <Button
                            type="primary"
                            block
                            loading={loading}
                            onClick={handleLogin}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        >
                            Login
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="text-center">
                    <Title level={2} className="text-blue-600">Welcome, Admin!</Title>
                    <Text className="text-lg">You have successfully logged in. Redirecting to Dashboard...</Text>
                    <Spin size="large" className="mt-4" />
                </div>
            )}
        </div>
    );
}

export default Home;
