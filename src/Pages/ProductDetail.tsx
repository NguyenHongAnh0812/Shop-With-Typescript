import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import { API_URL, cart, product } from "../Models/model";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
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
export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageSrc: "",
    imageAlt: "",
  });
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: false },
    { name: "About Us", href: "/AboutUs", current: false },
    { name: "Cart", href: "/Cart", current: false },
    { name: "Order", href: "/Order", current: false },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        // setError("Lấy sản phẩm thất bại");
        console.error(err);
      }
    };
    fetchProducts();
  }, []);
  const handleAddToCart = async (product: product) => {
    const usersJson = localStorage.getItem("user");
    const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
    const accessToken: string | undefined = userData?.accessToken;

    if (!accessToken) {
      window.location.href = "/Login";
    }

    try {
      const cartResponse = await fetch(
        `${API_URL}/carts?userId=${userData?.user.id}`
      );
      const cartItems: cart[] = await cartResponse.json();

      const existingProduct = cartItems.find(
        (item) => item.name === product.name
      );

      if (existingProduct) {
        const updatedQuantity = existingProduct.quantity + 1;

        const updateResponse = await fetch(
          `${API_URL}/carts/${existingProduct.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: updatedQuantity }),
          }
        );

        if (updateResponse.ok) {
          toast.success(`${product.name} quantity updated in cart!`, {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          throw new Error("Failed to update product quantity in cart");
        }
      } else {
        const addResponse = await fetch(`${API_URL}/carts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData?.user?.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            quantity: 1,
          }),
        });

        if (addResponse.ok) {
          toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            autoClose: 1500,
          });
        } else {
          throw new Error("Failed to add to cart");
        }
      }
    } catch (err) {
      toast.error("Failed to add product to cart", {
        position: "top-right",
        autoClose: 1500,
      });
      console.error(err);
    }
  };

  return (
    <>
      <Navbar navigationData={navigationData} />
      <ToastContainer/>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 mt-20 mb-10">
            {/* Product image */}
            <div className="aspect-w-2 aspect-h-1 rounded-lg bg-gray-200 overflow-hidden">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="mt-4 lg:mt-0">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h2>
              <p className="mt-2 text-3xl text-gray-900">${product.price}</p>

              <p className="mt-6 text-base text-gray-500">
                {product.description}
              </p>

              <div className="mt-10">
                <button
                  onClick={()=>handleAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
