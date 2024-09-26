
export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    rule: string;
}
export interface product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageSrc: string;
    imageAlt: string;
}
export interface cart extends product {
    userId: string;
    quantity: number;
}
export interface order {
    id: string;
    userId: string | undefined;
    name: string,
    address: string,
    phone: string,
    cartItems: cart[],
    date: string;
    total: number,
    status: "Delivered" | "Pending" | "In Transit";
  }
export const API_URL = "http://localhost:3001"