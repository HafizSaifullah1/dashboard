import React, { useEffect, useState } from 'react';
import { db } from '../configfirebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Table, Button, Modal, Input, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(snapshot.docs.map((doc, index) => ({
                id: doc.id,
                number: index + 1,
                ...doc.data(),
            })));
        });
        return unsubscribe;
    }, []);

    const addUser = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            message.warning('Please enter name, email, and password');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'users'), { name, email, password });
            message.success('User added successfully');
            setName('');
            setEmail('');
            setPassword('');
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding user:", error);
            message.error('Failed to add user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (user) => {
        setEditingUserId(user.id);
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setIsEditModalOpen(true);
    };

    const editUser = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            message.warning('Please enter name, email, and password');
            return;
        }

        setLoading(true);
        try {
            const userRef = doc(db, 'users', editingUserId);
            await updateDoc(userRef, { name, email, password });
            message.success('User updated successfully');
            setName('');
            setEmail('');
            setPassword('');
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error editing user:", error);
            message.error('Failed to edit user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            message.success('User deleted successfully');
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error('Failed to delete user. Please try again.');
        }
    };

    const columns = [
        { title: 'No.', dataIndex: 'number', key: 'number', className: 'font-bold' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, user) => (
                <div className="flex space-x-2">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(user)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold">Users List</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 shadow-lg"
                >
                    Add User
                </Button>
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 6 }}
                className="bg-white rounded-lg shadow-lg"
                locale={{ emptyText: "No users found" }}
            />

            {/* Modal Form for Adding Users */}
            <Modal
                title="Add New User"
                open={isModalOpen}
                onOk={addUser}
                onCancel={() => setIsModalOpen(false)}
                okText={loading ? <Spin /> : 'Add'}
                cancelText="Cancel"
                okButtonProps={{ disabled: loading }}
                width="40%"
                bodyStyle={{ padding: '10px', backgroundColor: '#f0f2f5' }}
            >
                <div className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user name"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter user password"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                </div>
            </Modal>

            {/* Modal Form for Editing Users */}
            <Modal
                title="Edit User"
                open={isEditModalOpen}
                onOk={editUser}
                onCancel={() => setIsEditModalOpen(false)}
                okText={loading ? <Spin /> : 'Update'}
                cancelText="Cancel"
                okButtonProps={{ disabled: loading }}
                width="40%"
                bodyStyle={{ padding: '10px', backgroundColor: '#f0f2f5' }}
            >
                <div className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user name"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter user email"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter user password"
                        className="border-2 border-gray-300 rounded-md py-2 px-3"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Users;
