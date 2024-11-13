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
        completed: false,
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

  // Toggle completion status
  const toggleCompletion = async (todo) => {
    try {
      const todoRef = doc(db, "todos", todo.id);
      await updateDoc(todoRef, { completed: !todo.completed });
      message.success("Task status updated!");
    } catch (error) {
      message.error("Error updating status: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="md:p-4 pt-10 px-4 bg-gray-900 min-h-screen text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Add New Task
        </Button>
      </div>

      {/* Todos List */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className={`rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
              todo.completed ? "bg-gray-700 text-gray-300" : "bg-purple-500 text-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <p
                className={`text-lg ${
                  todo.completed ? "line-through text-gray-400" : "text-white"
                }`}
                onClick={() => toggleCompletion(todo)}
              >
                {todo.text}
              </p>
              <div className="flex space-x-2">
                <Button
                  icon={<EditOutlined />}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => openEditModal(todo)}
                >
                  Edit
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-500 hover:bg-red-600 "
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Todo Modal */}
      <Modal
        title={editingTodo ? "Edit Task" : "Add New Task"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTodo(null);
          setNewTodoText("");
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={editingTodo ? editTodo : addTodo}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            {editingTodo ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Enter task"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md"
        />
      </Modal>
    </div>
  );
};

export default Todos;
