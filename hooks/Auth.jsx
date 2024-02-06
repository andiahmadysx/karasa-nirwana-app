import { useEffect, createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OrderProvider } from "./Order";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const AuthContext = createContext(null);

export const Provider = ({ children }) => {
    const [user, setUser] = useState(null);

    const getUserFromStorage = async () => {
        try {
            const value = await AsyncStorage.getItem('@user');
            if (value) {
                setUser(JSON.parse(value));

                return JSON.parse(value);
            }
        } catch (error) {
            console.error("Error retrieving user from storage:", error);
        }
    };


    useEffect(() => {
        getUserFromStorage();
    }, []); // Empty dependency array means this effect runs once on mount

    const saveUserToStorage = async (value) => {
        try {
            await AsyncStorage.setItem('@user', JSON.stringify(value));
            setUser(value);
        } catch (error) {
            console.error("Error saving user to storage:", error);
        }
    };

    const removeUser = async () => {
        setUser(null);
        try {
            await AsyncStorage.removeItem('@user');
        } catch (error) {
            console.error("Error removing user from storage:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser: saveUserToStorage, removeUser }}>
            <OrderProvider>
                <GluestackUIProvider config={config}>
                    {children}
                </GluestackUIProvider>
            </OrderProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
