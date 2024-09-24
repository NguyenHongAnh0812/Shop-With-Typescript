import React, { useState, useEffect } from "react";
import axios from "axios";
import { product } from "../Models/model";
import { AddProduct } from "./AddProduct";
import { EditProduct } from "./EditProduct";
import { Alert } from "@material-tailwind/react";
import Navbar, { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
import { toast, ToastContainer } from "react-toastify";

export const AdminProductList = () => {
  const [products, setProducts] = useState<product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
  const [productEdit, setProductEdit] = useState<product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageSrc: "",
    imageAlt: "",
  });

  const itemsPerPage = 4; // Set to 4 items per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<product[]>(
          "http://localhost:3001/products"
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError("Lấy sản phẩm thất bại");
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, products]);

  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) => {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  const handleOpenModal = () => {
    setIsModalAddOpen(true);
  };

  const handleCloseModalAdd = () => {
    setIsModalAddOpen(false);
  };
  const handleCloseModalEdit = () => {
    setIsModalEditOpen(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const navigationData: NavigationItem[] = [
    { name: "Home", href: "/", current: false },
    { name: "Product", href: "/ProductList", current: false },
    { name: "About Us", href: "/AboutUs", current: false },
    // { name: "Cart", href: "/Cart", current: false },
  ];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleEdit = (p: product) => {
    setIsModalEditOpen(true);
    setProductEdit(p);
  };
  const handleDelete = async (product: product) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Product deleted successfully:", response);
      // onClose(); // Close modal
      toast.success(`Delete ${product.name} successfull!`, {
        position: "top-right",
        autoClose: 1500,
      });
      setProducts((items) => items.filter((item) => item.id !== product.id));
      // window.location.href = "/Admin/ProductList";
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <>
      <Navbar navigationData={navigationData} />
      <ToastContainer />
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[1200px] mb-4 flex justify-between mr-20 mt-40">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 ml-20">
            All Products
          </h2>
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleOpenModal}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
        <div className="w-full max-w-[1200px] overflow-x-auto mb-10">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <button
                        onClick={handleSort}
                        className="flex items-center"
                      >
                        Price
                        <span className="ml-1">
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{ height: "350px" }}
                  className="bg-white divide-y divide-gray-200"
                >
                  {currentItems.length > 0 ? (
                    currentItems.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-1 whitespace-nowrap">
                          <div className="flex-shrink-0 h-20 w-20">
                            <img
                              className="h-20 w-20 object-contain rounded-md"
                              src={product.imageSrc}
                              alt={product.name}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            onClick={() => handleEdit(product)} // Correctly pass a function
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr style={{ height: "350px" }}>
                      <td colSpan={4} className="text-center p-4 text-gray-500">
                        No items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end items-center mt-4 w-full mr-24">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {isModalAddOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseModalAdd}
            ></div>
            <AddProduct onClose={handleCloseModalAdd} />{" "}
            {/* Truyền hàm đóng modal */}
          </div>
        )}
        {isModalEditOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseModalEdit}
            ></div>
            <EditProduct onClose={handleCloseModalEdit} product={productEdit} />{" "}
            {/* Truyền hàm đóng modal */}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
