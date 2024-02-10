import {useFocusEffect, useRouter} from "expo-router";
import {Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../hooks/Auth";
import {useLayoutEffect} from "react";
import OwnerDashboard from "./owner";

const Page = () => {

    const router = useRouter();

        useFocusEffect(() => {
            async function fetchData() {
                const response = await AsyncStorage.getItem('@user');
                const user = JSON.parse(response);
                navigateToNextPage(user);
            }
            fetchData();
        });

    const navigateToNextPage = async (user) => {
        if (!user) {
            await router.push("/login");
        } else {
            const allowedRoutes = {
                chef: "/chef",
                cashier: "/cashier",
                admin: '/admin',
                waiter: '/waiter',
                owner: '/owner'
            }; // Define allowed routes based on roles
            const route = allowedRoutes[user.role];

            if (route) {
                await router.navigate(route);
            } else {
                // Handle invalid roles (optional)
                console.error("Invalid user role:", user.role);
                await router.push("/error"); // Or redirect to a default route
            }
        }
    };

    return (
        <View>
            <Text>Silence is golden.</Text>
        </View>
    );
};

export default Page;

