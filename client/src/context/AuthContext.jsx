// AuthContext.jsx - Updated
import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext()

const authContext = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const response = await axios.get("http://localhost:3000/verify", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data.success) {
                        setUser(response.data.user);
                    } else {
                        // Token is invalid, clear it
                        localStorage.removeItem("token");
                        localStorage.removeItem("role");
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Verify error:", error);
                // Token verification failed, clear localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const login = (userData) => {
        setUser(userData.user);
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.user.role);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    return(
        <userContext.Provider value={{user, login, logout, loading}}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => useContext(userContext);
export default authContext;