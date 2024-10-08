import React, { useState, useEffect } from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { API_URL, cart } from "../Models/model";
import Navbar, { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Navigate } from "react-router-dom";
import ShippingForm from "./FormShipUser";
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

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<cart[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [item, setItem] = useState<cart>();
  const [codeDiscount, setCodeDiscount] = useState<string>("");
  const [isModalShipingOpen, setIsModalShipingOpen] = useState<boolean>(false);

  const handleCloseModalShiping = () => {
    setIsModalShipingOpen(false);
  };
  const handleOpenModalShiping = () => {
    if (cartItems.length == 0) {
      toast.error("Please add items", {
        position: "top-right",
        autoClose: 1500,
      });
    } else setIsModalShipingOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeDiscount(e.target.value);
  };
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: false },
    { name: "About Us", href: "/AboutUs", current: false },
    { name: "Cart", href: "/Cart", current: true },
    { name: "Order", href: "/Order", current: false },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<cart[]>(
          `${API_URL}/carts?userId=${userData?.user?.id}`
        );
        setCartItems(response.data);
      } catch (err) {
        
        console.error(err); 
      }
    };
    fetchProducts();
  }, []);
  const updateQuantity = async (
    cart: cart,
    newQuantity: number,
    items: cart[]
  ) => {
    
    const updatedItems = items.map((item) =>
      item.id === cart.id
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );

    setCartItems(updatedItems);

    try {
      const response = await fetch(
        `${API_URL}/carts/${cart.id}?userId=${userData?.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...cart,
            quantity: Math.max(1, newQuantity), 
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      toast.success(`Quantity updated to ${Math.max(1, newQuantity)}!`, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (err) {
      
      setCartItems(items);
      toast.error("Failed to update quantity", {
        position: "top-right",
        autoClose: 1500,
      });
      console.error(err);
    }
  };

  const removeItem = async (id: string | undefined) => {
    try {
      const response = await fetch(
        `${API_URL}/carts/${id}?userId=${userData?.user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Product deleted successfully:", response);
      
      toast.success(`Delete succesful`, {
        position: "top-right",
        autoClose: 1500,
      });
      setCartItems((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const usersJson = localStorage.getItem("user");

  const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
  const accessToken: string | undefined = userData?.accessToken;
  const rule: string | undefined = userData?.user?.rule;

  if (!accessToken) {
    return <Navigate to="/Login" />;
  }
  const handleDiscount = () => {
    if (codeDiscount.toUpperCase() == "BIGSALE") setDiscount(20);
    if (codeDiscount.toUpperCase() == "SALE") setDiscount(10);
    setCodeDiscount("");
  };
  return (
    <>
      <Navbar navigationData={navigationData} />
      <ToastContainer />
      <div className="font-sans md:max-w-4xl max-md:max-w-xl mx-auto bg-white py-4">
        <div className="grid md:grid-cols-3 gap-4 mt-40 mb-20">
          <div
            className="md:col-span-2 bg-gray-100 p-4 rounded-md overflow-x-auto"
            style={{ maxHeight: "400px", width: "100%" }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
            <hr className="border-gray-300 mt-4 mb-8" />

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-3 items-center gap-4"
                  style={{ tableLayout: "fixed" }}
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                      <img
                        src={item.imageSrc}
                        className="w-full h-full object-contain"
                        alt={item.imageAlt}
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <h6
                        className="text-xs text-red-500 cursor-pointer mt-0.5"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </h6>

                      <div className="flex gap-4 mt-4">
                        <div>
                          <button
                            type="button"
                            className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                          >
                            <Minus
                              className="w-4 h-4"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity - 1,
                                  cartItems
                                )
                              }
                            />
                            <span className="mx-2.5">{item.quantity}</span>
                            <Plus
                              className="w-4 h-4"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity + 1,
                                  cartItems
                                )
                              }
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <h4 className="text-base font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-md p-4 top-0">
            <div className="flex border border-blue-600 overflow-hidden rounded-md">
              <input
                type="text"
                placeholder="Promo code"
                value={codeDiscount}
                onChange={handleInputChange}
                className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
              />
              <button
                onClick={() => handleDiscount()}
                type="button"
                className="flex items-center justify-center font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white"
              >
                Apply
              </button>
            </div>

            <ul className="text-gray-800 mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-base">
                Discount{" "}
                <span className="ml-auto font-bold">
                  {discount}% = ${((total * discount) / 100).toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-base">
                Shipping <span className="ml-auto font-bold">$2.00</span>
              </li>
              <li className="flex flex-wrap gap-4 text-base">
                Tax <span className="ml-auto font-bold">$4.00</span>
              </li>
              <li className="flex flex-wrap gap-4 text-base font-bold">
                Total{" "}
                <span className="ml-auto">
                  ${(total + 6 - (total * discount) / 100).toFixed(2)}
                </span>
              </li>
            </ul>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => handleOpenModalShiping()}
                type="button"
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/ProductList")}
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        {isModalShipingOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseModalShiping}
            ></div>
            <ShippingForm
              onClose={handleCloseModalShiping}
              cartItems={cartItems}
              total={Number((total + 6 - (total * discount) / 100).toFixed(2))}
            />{" "}
            
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};
