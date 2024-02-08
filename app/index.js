import {useFocusEffect, useRouter} from "expo-router";
import {Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAuth} from "../hooks/Auth";

const Page = () => {
    const router = useRouter();



    const navigateToNextPage = async (user) => {
        if (!user) {
            await router.push("/login");
        } else {
            const allowedRoutes = {
                chef: "/chef",
                cashier: "/cashier",
                admin: '/cashier',
                waiter: '/waiter'
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

