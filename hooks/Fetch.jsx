import axios from "axios";
import {useAuth} from "./Auth";
import {useQuery} from 'react-query';


const Axios = axios.create({
    baseURL: 'http://' + process.env.BACKEND_HOST + '/karasa-nirwana-api/api',
});

export const usePost = (endpoint = '/') => {
    const {user} = useAuth();

    if (user) {
        Axios.defaults.headers.common = {
            Authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
            Accept: "application/json"
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


export const usePostFormData = (endpoint = '/') => {
    const {user} = useAuth();

    let headers = {
        "Content-Type": "multipart/form-data; charset=utf-8;"
    };

    if (user) {
        headers = {
            ...headers,
            Authorization: `Bearer ${user.token}`,
            Accept: 'application/json'
        };
    }

    const config = {
        headers,
    };

    return async (value = {}) => {
        try {
            const response = await Axios.post(endpoint, value, config);
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
            Authorization: `Bearer ${user.token}`,
            "content-type": "application/json",
            Accept: "application/json"
        }
    }

    return async (id, value = {}) => {
        try {
            const response = await Axios.put(endpoint + '/' + id, value);
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


export const useGet = (endpoint = '/') => {
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


export const useDelete = (endpoint = '/') => {
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

export const useFetch = async (getDataCallback, callback) => {
    try {
        const result = await getDataCallback();

        if (result.success) {
            return callback(result.data);
        } else {
            throw new Error(result.data);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const useCustomQuery = (queryKey, getDataCallback) => {
    const fetchData = async () => {
        try {
            const result = await getDataCallback();

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.data);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const {data, error, isLoading, refetch} = useQuery(queryKey, fetchData);

    return {data, error, isLoading, refetch};
};
export default useCustomQuery;

