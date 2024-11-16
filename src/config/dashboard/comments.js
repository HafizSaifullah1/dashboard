import { useState, useEffect } from "react";
import { Card, Button, Modal, Input, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../configfirebase";

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

  // Add or Edit comment logic
  const handleSaveComment = async () => {
    if (!newCommentText.trim()) {
      message.error("Comment cannot be empty!");
      return;
    }

    try {
      if (editingComment) {
        // Edit Comment
        const commentRef = doc(db, "comments", editingComment.id);
        await updateDoc(commentRef, { text: newCommentText });
        message.success("Comment updated successfully!");
      } else {
        // Add Comment
        await addDoc(collection(db, "comments"), {
          text: newCommentText,
          timestamp: new Date(),
        });
        message.success("Comment added successfully!");
      }

      setIsModalVisible(false);
      setEditingComment(null);
      setNewCommentText("");
    } catch (error) {
      message.error("Error saving comment: " + error.message);
    }
  };

  // Delete comment logic
  const handleDeleteComment = async (commentId) => {
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
    <div className="p-6 bg-gradient-to-r from-teal-400 to-indigo-500 min-h-screen text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Comments List</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md"
        >
          Add Comment
        </Button>
      </div>

      {/* Comments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className="p-6 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-500 text-white shadow-xl rounded-2xl transition-transform duration-300 hover:scale-105"
          >
            <p className="text-lg font-medium text-center mb-4">{comment.text}</p>
            <div className="flex justify-center gap-1 items-center">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingComment(comment);
                  setNewCommentText(comment.text);
                  setIsModalVisible(true);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-md"
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteComment(comment.id)}
                className="bg-red-500 hover:bg-red-600 rounded-md"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Comment Modal */}
      <Modal
        title={editingComment ? "Edit Comment" : "Add Comment"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingComment(null);
          setNewCommentText("");
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveComment}>
            {editingComment ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter comment"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Comments;
