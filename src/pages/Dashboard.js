import React from 'react';
import { Routes, Route, Link,  } from 'react-router-dom';
import Users from '../config/dashboard/users';
import Photos from '../config/dashboard/photos';
import Comments from '../config/dashboard/comments';
import Albums from '../config/dashboard/albums';
import Todos from '../config/dashboard/todos';

function Dashboard() {
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Sidebar */}
            <aside className="lg:w-1/4 w-full bg-gradient-to-b from-purple-700 to-blue-500 text-white p-6 shadow-lg">
                <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>
                <nav className="flex flex-col space-y-4">
                    <Link to="users" className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-semibold shadow-md">
                        Users
                    </Link>
                    <Link to="photos" className="p-3 bg-green-600 hover:bg-green-700 rounded-lg text-center font-semibold shadow-md">
                        Photos
                    </Link>
                    <Link to="comments" className="p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-center font-semibold shadow-md">
                        Comments
                    </Link>
                    <Link to="albums" className="p-3 bg-pink-600 hover:bg-pink-700 rounded-lg text-center font-semibold shadow-md">
                        Albums
                    </Link>
                    <Link to="todos" className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-center font-semibold shadow-md">
                        Todos
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-100 p-4 lg:p-10 overflow-y-auto">
                <div className="bg-white p-6 lg:p-8 rounded-xl shadow-lg">
                    {/* Nested Routes */}
                    <Routes>
                        <Route path="/users" element={<Users />} />
                        <Route path="/photos" element={<Photos />} />
                        <Route path="/comments" element={<Comments />} />
                        <Route path="albums" element={<Albums />} />
                        <Route path="/todos" element={<Todos />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
