export const pageValidation = async (user, router) => {
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
