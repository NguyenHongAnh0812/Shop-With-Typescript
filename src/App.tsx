import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import ProductList from "./Pages/ProductList";
import {ProductDetail} from "./Pages/ProductDetail";
import { AboutUs } from "./Pages/AboutUs";
import { AddProduct } from "./Admin/AddProduct";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AdminProductList } from "./Admin/AdminProductList";
import { PrivateRouter } from "./Components/PrivateRouter";
import { Cart } from "./Pages/Cart";
import LoginAdmin from "./Admin/LoginAdmin";
import RegisterAdmin from "./Admin/RegisterAdmin";
import Order from "./Pages/Order";
import AdminOrder from "./Admin/AdminOrder";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Admin" element={<PrivateRouter />}>
          <Route path="/Admin/ProductList" element={<AdminProductList />} />
          <Route path="/Admin/Order" element={<AdminOrder />} />
        </Route>
        <Route path="/Admin/Login" element={<LoginAdmin />} />
        <Route path="/Admin/Register" element={<RegisterAdmin />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
