import axios from "axios";
import {useAuth} from "./Auth";

const Axios = axios.create({
    baseURL: 'http://' + process.env.BACKEND_HOST + '/karasa-nirwana-api/api',
});

export const usePost = (endpoint = '/') => {
    const {user} = useAuth();

    if (user) {
        Axios.defaults.headers.common = {
            Authorization: `Bearer ${user.token}`
        }
    }

    return async (value = {}) => {
        try {
            const response = await Axios.post(endpoint, value);
            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            return {
                success: false,
                data: e.response.data
            }
        }
    }
}

export const useUpdate = (endpoint = '/') => {
    const {user} = useAuth();

    if (user) {
        Axios.defaults.headers.common = {
            Authorization: `Bearer ${user.token}`
        }
    }

    return async (value = {}) => {
        try {
            const response = await Axios.patch(endpoint, value);
            return {
                success: true,
                data: response.data
            }
        } catch (e) {
            return {
                success: false,
                data: e.response.data
            }
        }
    }
}


export const useGet = (endpoint = '/')=> {
    const {user} = useAuth();

    if (user) {
        Axios.defaults.headers.common = {
            Authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
            Accept: "application/json"
        }
    }

    return async ()  => {
        try {
            const response = await Axios.get(endpoint);

            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                data: e.response.data
            };
        }
    }
}


export const useDelete = (endpoint = '/')=> {
    const {user} = useAuth();

    if (user) {
        Axios.defaults.headers.common = {
            Authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
            Accept: "application/json"
        }
    }

    return async () => {
        try {
            const response = await Axios.delete(endpoint);

            return {
                success: true,
                data: response.data
            };
        } catch (e) {
            return {
                success: false,
                data: e.response.data
            };
        }
    }
}
