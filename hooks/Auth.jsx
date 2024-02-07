import { useEffect, createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export const Provider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const value = await AsyncStorage.getItem("@user");

                if (value) {
                    setUser(JSON.parse(value));
                }
            } catch (error) {
                console.error("Error fetching user from storage:", error);
            }
        };

        fetchUser();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const saveUserToStorage = async (value) => {
        try {
            await setUser(value);
            await AsyncStorage.setItem("@user", JSON.stringify(value));
        } catch (error) {
            console.error("Error saving user to storage:", error);
        }
    };

    const removeUser = async () => {
        await setUser(null);
        try {
            await AsyncStorage.removeItem("@user");
        } catch (error) {
            console.error("Error removing user from storage:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser: saveUserToStorage, removeUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
