import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import { product } from "../Models/model";
import { useParams } from "react-router-dom";


export const ProductDetail = () => {
  const {id} = useParams();
  const [product,setProduct] = useState<product>({
    name: "",
    description: "",
    price: 0,
    imageSrc: "",
    imageAlt: "",
  })
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: false },
    { name: "About Us", href: "/AboutUs", current: false },
    { name: "Cart", href: "/Cart", current: false },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/products/${id}`);
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
  const handleAddToCart = () => {
    alert(`${product.name} added to cart!`);
    // Logic thêm sản phẩm vào giỏ hàng có thể được thêm tại đây
  };

  return (
    <>
      <Navbar navigationData={navigationData} />
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
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
