import React from "react";
import { order } from "../Models/model";

const OrderDetail: React.FC<{ order: order; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Date:</strong> {order.date}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p className="text-lg text-right">
            <strong>Total:</strong> ${order.total}
          </p>
        </div>
        <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
        <div className="overflow-y-auto max-h-[300px] relative">
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 flex items-center">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2">${item.price}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
