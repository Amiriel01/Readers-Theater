import axios from 'axios';
let customAxios = axios.create({
    transformRequest: axios.defaults.transformRequest,
    transformResponse: axios.defaults.transformResponse,
    baseURL: import.meta.env.DEV ? "http://localhost:3000/" : "oeoewvoewvbowevb"
});

export function updateWithKey(key: string) {
    customAxios.defaults.headers.common.Authorization = `Bearer ${key}`;
}

export default customAxios;