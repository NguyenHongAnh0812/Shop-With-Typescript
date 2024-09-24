import { Navigate, Outlet } from "react-router-dom";

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

export const PrivateRouter = () => {
    const usersJson = localStorage.getItem("user");

    const userData: UserData | null = usersJson ? JSON.parse(usersJson) : null;
    const accessToken: string | undefined = userData?.accessToken;
    const rule: string | undefined = userData?.user?.rule;

    if (!accessToken) {
        return <Navigate to="/Login" />;
    }

    if (rule !== "admin") {
        return <Navigate to="/ProductList" />;
    }

    return <Outlet />; 
};