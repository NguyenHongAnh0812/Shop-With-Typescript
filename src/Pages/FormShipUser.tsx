import React, { useState } from "react";
import { API_URL, cart, order } from "../Models/model";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

interface ShippingFormData {
  name: string;
  address: string;
  phone: string;
}

interface ShippingFormProps {
  onClose: () => void;
  cartItems: cart[];
  total: number;
}
interface User {
  rule: string; // "user" hoặc "admin"
  email: string;
  name: string;
  id: string;
}
// interface order extends ShippingFormData {
//   id?: string;
//   cartItems: cart[],
//   date: string;
//   status: "Delivered" | "Pending";
// }

interface UserData {
  accessToken: string;
  user: User;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  onClose,
  cartItems,
  total,
}) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: "",
    address: "",
    phone: "",
  });
  const currentDate = new Date();
  const formattedDate: string = currentDate.toLocaleDateString("vi-VN");
  const [order, setOrder] = useState<order>({
    id: "",
    userId: "",
    date: formattedDate,
    cartItems: cartItems,
    name: formData.name,
    address: formData.address,
    phone: formData.phone,
    total: 0,
    status: "Pending",
  });
  const [submitted, setSubmitted] = useState(false);
  const usersJson = localStorage.getItem("user");
  const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
  const accessToken: string | undefined = userData?.accessToken;
  const userId: string | undefined = userData?.user?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission
    if (cartItems.length === 0) {
      toast.error("No Item, please add item", {
        position: "top-right",
        autoClose: 1500,
      });
    } else {
      try {
        // Create the order object
        const newOrder: order = {
          id: uuidv4(),
          userId: userId,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          cartItems: cartItems,
          date: formattedDate,
          total: total,
          status: "Pending",
        };

        // Send POST request to create a new order
        const response = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include token if needed
          },
          body: JSON.stringify(newOrder),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        // If order created successfully, delete items from cart
        const deletePromises = cartItems.map((item) =>
          fetch(`${API_URL}/carts/${item.id}?userId=${userData?.user.id}`, {
            method: "DELETE",
          })
        );

        await Promise.all(deletePromises);
        onClose();
        alert("Checkout successful");
        window.location.href = "/Order"; // Redirect after successful deletion
      } catch (error) {
        console.error("Failed to create order:", error);
        alert("Failed to create order.");
      }
    }
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-md p-6 z-10 max-w-2xl w-full flex justify-center"
      >
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Delivery information
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name :
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShippingForm;
