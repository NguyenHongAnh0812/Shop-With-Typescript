import React from "react";
import Navbar from "../Components/Navbar";
import ProductList from "./ProductList";
import { NavigationItem } from "../Components/Navbar";
import Footer from "../Components/Footer";
export const Home = () => {
    const navigationData: NavigationItem[] = [
        { name: "Home", href: "/", current: true },
        { name: "Product", href: "/ProductList", current: false },
        { name: "About Us", href: "/AboutUs", current: false},
        { name: "Cart", href: "/Cart", current: false },
        { name: "Order", href: "/Order", current: false},
      ];
    return (
        <>
        <Navbar navigationData={navigationData} />
        <div className="flex justify-center" >
            <img className="mt-30 w-full h-full" src="https://webed.netlify.app/public/img/tailwind-banner.jpg" alt="" />
        </div>
        
        <Footer/>
        </>
    )
}