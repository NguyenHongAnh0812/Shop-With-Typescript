import React, { useState } from "react";
import { API_URL, product } from "../Models/model";
import { useNavigate } from 'react-router-dom';

interface AddProductProps {
  onClose: () => void;
}

export const AddProduct: React.FC<AddProductProps> = ({ onClose }) => {
  const [productData, setProduct] = useState<Omit<product, "id">>({
    name: "",
    description: "",
    price: 0,
    imageSrc: "",
    imageAlt: "",
  });
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setProduct((prev) => ({ ...prev, imageSrc: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      console.log(response);
      // Reset form sau khi thêm sản phẩm thành công
      setProduct({
        name: "",
        description: "",
        price: 0,
        imageSrc: "",
        imageAlt: "",
      });
      setImage(null);
      onClose(); // Đóng modal
      alert(`Add succesful`)
      window.location.href = '/Admin/ProductList'
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 z-10 max-w-2xl w-full flex">
      <div className="w-1/2 pr-4">
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name :</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description :</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price :</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <div className="upload-area mb-4 border-2 border-dashed border-gray-600 p-4 text-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleImageChange}
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <span className="text-gray-500">
                Kéo và thả ảnh vào đây hoặc nhấp để chọn
              </span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image Description :</label>
            <input
              type="text"
              name="imageAlt"
              value={productData.imageAlt}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </form>
      </div>
      {image && (
        <div className="w-1/2 pl-4">
          <img
            src={image}
            alt={productData.imageAlt}
            className="w-full h-auto rounded-lg mb-4"
          />
        </div>
      )}
    </div>
  );
};