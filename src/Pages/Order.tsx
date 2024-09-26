import React, { useEffect, useState } from "react";
import OrderDetail from "./OrderDetail";
import { API_URL, order } from "../Models/model";
import Navbar from "../Components/Navbar";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
interface User {
    rule: string; // "user" hoặc "admin"
    email: string;
    name: string;
    id: string;
  }
  
  interface UserData {
    accessToken: string;
    user: User;
  }
const Order = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState<order[]>([]);
  const [orderDetail, setOrderDetail] = useState<order>();
  const usersJson = localStorage.getItem("user")
  const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
  
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: false },
    { name: "About Us", href: "/AboutUs", current: false },
    { name: "Cart", href: "/Cart", current: false },
    { name: "Order", href: "/Order", current: true },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders?userId=${userData?.user.id}`);
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

  return (
    <>
      <Navbar navigationData={navigationData} />
      <div className="font-sans mx-auto max-w-screen-xl bg-white py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-4 text-center my-20">Order List</h1>
        <div className="overflow-x-auto">
          <div className="overflow-y-auto h-[350px] flex justify-center items-center">
            {orderData.length === 0 ? ( // Kiểm tra số lượng đơn hàng
              <p className="text-center text-gray-500">No Order</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 h-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="w-1/5 px-4 py-2 text-left">Order ID</th>
                    <th className="w-1/5 px-4 py-2 text-left">Date</th>
                    <th className="w-1/5 px-4 py-2 text-left">Name</th>
                    <th className="w-1/5 px-4 py-2 text-left">Status</th>
                    <th className="w-1/5 px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 h-1/5">
                  {orderData.map((order) => (
                    <tr key={order.id}>
                      <td className="w-1/5 px-4 py-2">{order.id}</td>
                      <td className="w-1/5 px-4 py-2">{order.date}</td>
                      <td className="w-1/5 px-4 py-2">{order.name}</td>
                      <td className="w-1/5 px-4 py-2">
                        <span
                          className={`font-bold ${
                            order.status === "Pending"
                              ? "text-red-500"
                              : order.status === "Delivered"
                              ? "text-green-500"
                              : order.status === "In Transit"
                              ? "text-blue-500"
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
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
            )}
          </div>
          {isOpen && orderDetail && (
            <OrderDetail order={orderDetail} onClose={() => setIsOpen(false)} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Order;