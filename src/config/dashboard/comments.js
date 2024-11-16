import { useState, useEffect } from "react";
import { Card, Button, Modal, Input, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../configfirebase';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState("");

    // Fetch comments from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "comments"), (snapshot) => {
            const commentList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentList);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Add a new comment to Firestore
    const addComment = async () => {
        if (!newCommentText.trim()) {
            message.error("Please enter a comment!");
            return;
        }

        try {
            await addDoc(collection(db, "comments"), {
                text: newCommentText,
                timestamp: new Date(),
            });
            message.success("Comment added successfully!");
            setIsModalVisible(false);
            setNewCommentText("");
        } catch (error) {
            message.error("Error adding comment: " + error.message);
        }
    };

    // Open edit modal for an existing comment
    const openEditModal = (comment) => {
        setEditingComment(comment);
        setNewCommentText(comment.text);
        setIsModalVisible(true);
    };

    // Edit an existing comment
    const editComment = async () => {
        if (!newCommentText.trim()) {
            message.error("Comment cannot be empty!");
            return;
        }

        try {
            const commentRef = doc(db, "comments", editingComment.id);
            await updateDoc(commentRef, { text: newCommentText });
            message.success("Comment updated successfully!");
            setIsModalVisible(false);
            setEditingComment(null);
            setNewCommentText("");
        } catch (error) {
            message.error("Error updating comment: " + error.message);
        }
    };

    // Delete a comment from Firestore
    const deleteComment = async (commentId) => {
        try {
            await deleteDoc(doc(db, "comments", commentId));
            message.success("Comment deleted successfully!");
        } catch (error) {
            message.error("Error deleting comment: " + error.message);
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
        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-teal-400 to-indigo-500 min-h-screen text-white">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">Comments List</h2>
                <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md shadow-lg"
                >
                    Add Comment
                </Button>
            </div>

            {/* Comments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
    {comments.map((comment) => (
        <Card
            key={comment.id}
            className="p-8 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-500 text-white shadow-2xl rounded-3xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl max-w-xs w-full"
        >
            {/* Comment Text */}
            <p className="text-xl font-semibold text-center mb-6">{comment.text}</p>

            {/* Buttons Section */}
            <div className="flex flex-col gap-4 items-center">
                {/* Edit Button */}
                <Button
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(comment)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full px-6 py-2 transition-transform transform hover:scale-110 duration-200"
                >
                    Edit
                </Button>
                {/* Delete Button */}
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => deleteComment(comment.id)}
                    className="bg-red-500 hover:bg-red-600 rounded-full px-6 py-2 transition-transform transform hover:scale-110 duration-200"
                >
                    Delete
                </Button>
            </div>
        </Card>
    ))}
</div>



            {/* Add/Edit Comment Modal */}
            <Modal
                title={<span className="text-lg font-semibold">{editingComment ? "Edit Comment" : "Add Comment"}</span>}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingComment(null);
                    setNewCommentText("");
                }}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)} className="rounded-md">
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={editingComment ? editComment : addComment}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                        {editingComment ? "Save" : "Add"}
                    </Button>,
                ]}
                className="bg-gradient-to-b from-blue-800 to-blue-600 text-white rounded-md"
            >
                <Input
                    placeholder="Enter comment"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="rounded-md"
                />
            </Modal>
        </div>
    );
};

export default Comments;
