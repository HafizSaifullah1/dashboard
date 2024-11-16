import { useState, useEffect } from "react";
import { Card, Button, Modal, Upload, Input, message, Spin } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../configfirebase";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newName, setNewName] = useState("");

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
      message.error("Failed to load photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle file selection
  const handleFileChange = ({ file }) => {
    if (file.type.startsWith("image/")) {
      const selectedBlob = file.originFileObj;
      setSelectedFile(selectedBlob);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedBlob);
    } else {
      message.error("Invalid file type selected. Please select an image.");
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  // Upload a photo
  const handleUpload = async () => {
    if (!selectedFile) {
      message.error("Please select a file first!");
      return;
    }

    const uniqueName = `${Date.now()}_${selectedFile.name}`;
    const storageRef = ref(storage, `photos/${uniqueName}`);

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
      console.error("Upload Error:", error);
      message.error("Error uploading photo: " + error.message);
    }
  };

  // Delete a photo
  const handleDelete = async (photoId, photoUrl) => {
    try {
      const imageRef = ref(storage, photoUrl);
      console.log("Deleting file from URL:", photoUrl);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "photos", photoId));
      message.success("Photo deleted successfully!");
      fetchPhotos();
    } catch (error) {
      console.error("Delete Error:", error);
      message.error("Error deleting photo: " + error.message);
    }
  };

  // Open edit modal
  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setNewName(photo.name);
    setIsModalVisible(true);
  };

  // Save edited photo
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
      console.error("Edit Error:", error);
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
    <div className="p-4 bg-gray-900 text-gray-300 min-h-screen">
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">Photos List</h2>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          className="bg-black hover:bg-gray-700 text-gray-300 border-none"
        >
          Add Photo
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} className="bg-gray-800 shadow-lg rounded-lg">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2 truncate">{photo.name}</h3>
              <Button
                icon={<EditOutlined />}
                onClick={() => openEditModal(photo)}
                className="bg-gray-700 text-white hover:bg-gray-600 w-full"
                size="small"
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(photo.id, photo.url)}
                className="mt-2 w-full"
                size="small"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title={editingPhoto ? "Edit Photo Name" : "Upload Photo"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPhoto(null);
          setSelectedFile(null);
          setImagePreview(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={editingPhoto ? handleEditSave : handleUpload}
          >
            {editingPhoto ? "Save" : "Upload"}
          </Button>,
        ]}
      >
        {editingPhoto ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          <Upload
            onChange={handleFileChange}
            accept="image/*"
            maxCount={1}
            fileList={[]} 
          >
            <Button icon={<UploadOutlined />}>Select Photo</Button>
          </Upload>
        )}
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full" />}
      </Modal>
    </div>
  );
};

export default Photos;
