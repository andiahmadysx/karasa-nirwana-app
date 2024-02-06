import { useLayoutEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/Auth";

const Page = () => {
    const router = useRouter();
    const { user } = useAuth();


    useLayoutEffect(() => {
        navigateToNextPage(user); // Pass user data to the function
    }, []);

    const navigateToNextPage = async (user) => {
        if (!user) {
            await router.push('/login');
        } else {
            if (user.role === 'admin') {
                await router.push('/cashier');
            }
        }
    };

    return null;
};

export default Page;
