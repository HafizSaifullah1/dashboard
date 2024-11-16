import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import Dashboard from '../../pages/Dashboard';

function AppRouter() {
    return (
        <BrowserRouter>

            <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="dashboard/*" element={<Dashboard />} /> {/* Ensure this matches */}
            </Routes>

        </BrowserRouter>

    );
}

export default AppRouter;
