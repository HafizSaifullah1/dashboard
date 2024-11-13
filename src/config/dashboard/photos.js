import { useState, useEffect } from "react";
import { Card, Button, Modal, Upload, Input, message, Spin } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from '../configfirebase';

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null); // Track which photo is being edited
  const [newName, setNewName] = useState(""); // Track updated name

  // Fetch photos from Firestore
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const photosCollection = collection(db, "photos");
      const snapshot = await getDocs(photosCollection);
      const photoList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(photoList);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle file selection and preview
  const handleFileChange = ({ file }) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo upload to Firebase
  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("Please select a file first!");
      return;
    }

    const storageRef = ref(storage, `photos/${selectedFile.name}`);
    try {
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url: downloadURL,
        name: selectedFile.name,
        timestamp: new Date(),
      });

      message.success("Photo uploaded successfully!");
      setIsModalVisible(false);
      setSelectedFile(null);
      setImagePreview(null);
      fetchPhotos();
    } catch (error) {
      message.error("Error uploading photo: " + error.message);
    }
  };

  // Handle delete photo
  const handleDelete = async (photoId, photoUrl) => {
    try {
      const imageRef = ref(storage, photoUrl);
      await deleteObject(imageRef);

      await deleteDoc(doc(db, "photos", photoId));
      message.success("Photo deleted successfully!");

      fetchPhotos();
    } catch (error) {
      message.error("Error deleting photo: " + error.message);
    }
  };

  // Open edit modal and set the photo to be edited
  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setNewName(photo.name);
    setIsModalVisible(true);
  };

  // Handle photo name update
  const handleEditSave = async () => {
    if (!newName.trim()) {
      message.error("Name cannot be empty!");
      return;
    }

    try {
      const photoRef = doc(db, "photos", editingPhoto.id);
      await updateDoc(photoRef, { name: newName });
      message.success("Photo name updated successfully!");

      setIsModalVisible(false);
      setEditingPhoto(null);
      setNewName("");
      fetchPhotos();
    } catch (error) {
      message.error("Error updating photo: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="md:p-4 pt-10 px-4 bg-gray-900 text-gray-300 min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">Photos List</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-black hover:bg-gray-700 text-gray-300 font-semibold border-none"
        >
          Add Photos
        </Button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card
            key={photo.id}
            className="bg-gray-800 shadow-md rounded-lg overflow-hidden"
            cover={<img src={photo.url} alt={photo.name} className="w-full h-48 object-cover" />}
          >
            <h3 className="text-white font-semibold mb-2">{photo.name}</h3>
            <div className="flex justify-between mt-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => openEditModal(photo)}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(photo.id, photo.url)}
                className="bg-red-600  hover:bg-red-500"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Photo Modal */}
      <Modal
        title={editingPhoto ? "Edit Photo Name" : "Upload Photo"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPhoto(null);
          setSelectedFile(null);
          setImagePreview(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)} className="text-gray-300 bg-gray-700 border-none">
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={editingPhoto ? handleEditSave : handleUpload}
            className="bg-black hover:bg-gray-700 text-gray-300 border-none"
          >
            {editingPhoto ? "Save" : "Upload"}
          </Button>,
        ]}
        className="bg-gray-900 text-gray-300"
      >
        {editingPhoto ? (
          <Input
            placeholder="Edit photo name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-gray-700 text-gray-300 border-none rounded-md"
          />
        ) : (
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} className="bg-gray-700 text-gray-300 hover:bg-gray-600">
              Select Photo
            </Button>
          </Upload>
        )}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-gray-400">Preview:</p>
            <img
              src={imagePreview}
              alt="Selected File"
              className="w-full h-auto rounded-lg border border-gray-600"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Photos;
