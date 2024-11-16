import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("userToken"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await axios.get("http://localhost:3000/api/users/me", {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    });

                    setUser(response.data); // Update the user state
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setToken(null);
                    localStorage.removeItem("userToken");
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    // Update localStorage when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("userToken", token);
        } else {
            localStorage.removeItem("userToken");
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ token, setToken, user, setUser, loading }}>
            {props.children}
        </UserContext.Provider>
    );
};
