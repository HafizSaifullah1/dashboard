import { useState, useEffect } from "react";
import { Card, Button, Modal, Input, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../configfirebase';

const Albums = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null);
    const [albumName, setAlbumName] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "albums"), (snapshot) => {
            const albumList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAlbums(albumList);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const addAlbum = async () => {
        if (!albumName.trim()) {
            message.error("Please enter an album name!");
            return;
        }

        try {
            await addDoc(collection(db, "albums"), {
                name: albumName,
                timestamp: new Date(),
            });
            message.success("Album added successfully!");
            setIsModalVisible(false);
            setAlbumName("");
        } catch (error) {
            message.error("Error adding album: " + error.message);
        }
    };

    const openEditModal = (album) => {
        setEditingAlbum(album);
        setAlbumName(album.name);
        setIsModalVisible(true);
    };

    const editAlbum = async () => {
        if (!albumName.trim()) {
            message.error("Album name cannot be empty!");
            return;
        }

        try {
            const albumRef = doc(db, "albums", editingAlbum.id);
            await updateDoc(albumRef, { name: albumName });
            message.success("Album updated successfully!");
            setIsModalVisible(false);
            setEditingAlbum(null);
            setAlbumName("");
        } catch (error) {
            message.error("Error updating album: " + error.message);
        }
    };

    const deleteAlbum = async (albumId) => {
        try {
            await deleteDoc(doc(db, "albums", albumId));
            message.success("Album deleted successfully!");
        } catch (error) {
            message.error("Error deleting album: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="md:p-4 pt-10 px-4 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-4 text-white">
                <h2 className="text-2xl font-bold">Albums List</h2>
                <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md"
                >
                    Add Album
                </Button>
            </div>

            {/* Albums Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {albums.map((album) => (
                    <Card
                        key={album.id}
                        className="bg-white shadow-lg rounded-lg transform transition duration-300 hover:scale-105"
                        style={{
                            borderLeft: "8px solid #ff6347",
                        }}
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{album.name}</h3>
                        <div className="flex justify-between mt-2">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => openEditModal(album)}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            >
                                Edit
                            </Button>
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => deleteAlbum(album.id)}
                                className="bg-red-500 hover:bg-red-600  rounded-md"
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Add/Edit Album Modal */}
            <Modal
                title={editingAlbum ? "Edit Album" : "Add Album"}
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingAlbum(null);
                    setAlbumName("");
                }}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)} className="rounded-md">
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={editingAlbum ? editAlbum : addAlbum}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-md"
                    >
                        {editingAlbum ? "Save" : "Add"}
                    </Button>,
                ]}
            >
                <Input
                    placeholder="Enter album name"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className="rounded-md border-gray-300 focus:border-blue-500"
                />
            </Modal>
        </div>
    );
};

export default Albums;
