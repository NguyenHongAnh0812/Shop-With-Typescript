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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Admin" element={<PrivateRouter />}>
          <Route path="/Admin/ProductList" element={<AdminProductList />} />
        </Route>
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
