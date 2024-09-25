import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cart, product } from "../Models/model";
import { useNavigate } from "react-router-dom";

interface User {
  rule: string;
  email: string;
  name: string;
  id: string;
}

interface UserData {
  accessToken: string;
  user: User;
}

export default function ProductList() {
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: true },
    { name: "About Us", href: "/AboutUs", current: false },
    { name: "Cart", href: "/Cart", current: false },
  ];

  const [products, setProducts] = useState<product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // Số sản phẩm trên mỗi trang

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Khởi tạo filteredProducts
      } catch (err) {
        setError("Lấy sản phẩm thất bại");
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedQuery)
    );

    const sorted = filtered.sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    setFilteredProducts(sorted);
    setCurrentPage(1);
  }, [searchQuery, sortOrder, products]);

  const handleAddToCart = async (product: product) => {
    const usersJson = localStorage.getItem("user");
    const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
    const accessToken: string | undefined = userData?.accessToken;

    if (!accessToken) {
      window.location.href = "/Login";
    } else {
      try {
        const cartResponse = await fetch(
          `http://localhost:3001/carts?userId=${userData?.user.id}`
        );
        const cartItems: cart[] = await cartResponse.json();

        const existingProduct = cartItems.find(
          (item) => item.name === product.name
        );

        if (existingProduct) {
          const updatedQuantity = existingProduct.quantity + 1;

          const updateResponse = await fetch(
            `http://localhost:3001/carts/${existingProduct.id}`,
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
          const addResponse = await fetch("http://localhost:3001/carts", {
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
    }
  };

  // Phân trang
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <Navbar navigationData={navigationData} />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Products
          </h2>

          {/* Tìm kiếm */}
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded p-2"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="ml-2 border rounded p-2"
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          {/* Hiển thị sản phẩm hoặc thông báo không có sản phẩm */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {currentProducts.map((product) => (
                  <div key={product.id} className="group">
                    <a
                      href="#"
                      onClick={() =>
                        (window.location.href = `/ProductDetail/${product.id}`)
                      }
                    >
                      <div className="w-64 h-64 overflow-hidden rounded-lg shadow-lg">
                        <img
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700 truncate w-64">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ${product.price}
                      </p>
                    </a>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              <div className="mt-4 flex justify-end">
                {Array.from(
                  { length: Math.ceil(filteredProducts.length / itemsPerPage) },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`mx-1 px-3 py-1 border rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer />
      <Footer />
    </>
  );
}
