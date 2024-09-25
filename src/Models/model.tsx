
export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    rule: string;
}
export interface product {
    id?: string;
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

export const API_URL = "http://localhost:3001"