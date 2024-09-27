import React, { useEffect, useState } from "react";
import AdminOrderDetail from "./AdminOrderDetail";
import { API_URL, order } from "../Models/model";
import Navbar from "../Components/Navbar";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast, ToastContainer } from "react-toastify";

interface User {
  rule: string; // "user" or "admin"
  email: string;
  name: string;
  id: string;
}

interface UserData {
  accessToken: string;
  user: User;
}

const AdminOrder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState<order[]>([]);
  const [orderDetail, setOrderDetail] = useState<order>();
  const usersJson = localStorage.getItem("user");
  const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;

  const navigationData: NavigationItem[] = [
    { name: "Products", href: "/Admin/ProductList", current: false },
    { name: "Orders", href: "/Admin/Order", current: true },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const handleOrderDetail = (order: order) => {
    setOrderDetail(order);
    setIsOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrderData((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      toast.success("Order status updated successfully", {
        position: "top-right",
        autoClose: 1000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  return (
    <>
      <Navbar navigationData={navigationData} />
      <ToastContainer />
      <div className="overflow-x-auto flex justify-center">
        <div className="overflow-y-auto h-[400px] mt-20 max-w-[1200px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 h-1/5 overflow-y-auto">
              {orderData.map((order) => (
                <tr key={order.id}>
                  <td className="w-1/5 px-4 py-2">{order.id}</td>
                  <td className="w-1/5 px-4 py-2">{order.date}</td>
                  <td className="w-1/5 px-4 py-2">{order.name}</td>
                  <td className="w-1/5 px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`font-bold ${
                        order.status === "Pending"
                          ? "text-red-500"
                          : order.status === "Delivered"
                          ? "text-green-500"
                          : order.status === "In Transit"
                          ? "text-blue-500"
                          : ""
                      }`}
                      disabled={order.status === "Delivered"}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="w-1/5 px-4 py-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => handleOrderDetail(order)}
                    >
                      Order Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isOpen && orderDetail && (
          <AdminOrderDetail
            order={orderDetail}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminOrder;
