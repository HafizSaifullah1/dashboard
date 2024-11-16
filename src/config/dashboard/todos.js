import { useState, useEffect } from "react";
import { Card, Button, Modal, Input, message, Spin } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../configfirebase';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [newTodoText, setNewTodoText] = useState("");

    // Fetch todos from Firestore in real-time
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
            const todoList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTodos(todoList);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Add a new todo to Firestore
    const addTodo = async () => {
        if (!newTodoText.trim()) {
            message.error("Please enter a task!");
            return;
        }

        try {
            await addDoc(collection(db, "todos"), {
                text: newTodoText,
                timestamp: new Date(),
            });
            message.success("Task added successfully!");
            setIsModalVisible(false);
            setNewTodoText("");
        } catch (error) {
            message.error("Error adding task: " + error.message);
        }
    };

    // Open edit modal for an existing todo
    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setNewTodoText(todo.text);
        setIsModalVisible(true);
    };

    // Edit an existing todo
    const editTodo = async () => {
        if (!newTodoText.trim()) {
            message.error("Task cannot be empty!");
            return;
        }

        try {
            const todoRef = doc(db, "todos", editingTodo.id);
            await updateDoc(todoRef, { text: newTodoText });
            message.success("Task updated successfully!");
            setIsModalVisible(false);
            setEditingTodo(null);
            setNewTodoText("");
        } catch (error) {
            message.error("Error updating task: " + error.message);
        }
    };

    // Delete a todo from Firestore
    const deleteTodo = async (todoId) => {
        try {
            await deleteDoc(doc(db, "todos", todoId));
            message.success("Task deleted successfully!");
        } catch (error) {
            message.error("Error deleting task: " + error.message);
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
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-purple-500 to-pink-500 min-h-screen text-white">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Todo List</h2>
                <Button
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-lg text-sm sm:text-base"
                >
                    Add Task
                </Button>
            </div>

            {/* Todo List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center">
    {todos.map((todo) => (
        <Card
            key={todo.id}
            className="p-8 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-500 text-white shadow-2xl rounded-3xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl max-w-xs w-full"
        >
            {/* Todo Text */}
            <p className="text-xl font-semibold text-center mb-6">{todo.text}</p>

            {/* Buttons Section */}
            <div className="flex flex-col gap-4 items-center">
                {/* Edit Button */}
                <Button
                    icon={<EditOutlined />}
                    onClick={() => openEditModal(todo)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full px-6 py-2 transition-transform transform hover:scale-110 duration-200"
                >
                    Edit
                </Button>
                {/* Delete Button */}
                <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 hover:bg-red-600  rounded-full px-6 py-2 transition-transform transform hover:scale-110 duration-200"
                >
                    Delete
                </Button>
            </div>
        </Card>
    ))}
</div>




            {/* Add/Edit Task Modal */}
            <Modal
                title={<span className="text-lg font-semibold">{editingTodo ? "Edit Task" : "Add Task"}</span>}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingTodo(null);
                    setNewTodoText("");
                }}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)} className="rounded-md text-xs sm:text-sm">
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={editingTodo ? editTodo : addTodo}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-md text-xs sm:text-sm"
                    >
                        {editingTodo ? "Save" : "Add"}
                    </Button>,
                ]}
                className="bg-gradient-to-b from-blue-800 to-blue-600 text-white rounded-md"
            >
                <Input
                    placeholder="Enter task"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    className="rounded-md"
                />
            </Modal>
        </div>
    );
};

export default Todos;
