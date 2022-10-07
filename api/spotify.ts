import axios, { AxiosInstance } from "axios";

export default class SpotifyAPI {
    instance: AxiosInstance;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    access_token: string;
    refresh_token: string;

    constructor(client_id, client_secret, redirect_uri) {
        this.instance = axios.create({ baseURL: "https://api.spotify.com/v1" });
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;

        this.instance.interceptors.request.use((config) => {
            if (this.access_token) config.headers.Authorization = "Bearer " + this.access_token;
            return config;
        });
    }

    exchange(code) {
        return axios
            .post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: this.redirect_uri,
                }),
                { auth: { username: this.client_id, password: this.client_secret } }
            )
            .then((res) => {
                this.access_token = res.data.access_token;
                this.refresh_token = res.data.refresh_token;
                return res.data;
            });
    }

    refresh(refresh_token) {
        this.refresh_token = refresh_token;
        return axios
            .post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refresh_token,
                }),
                { auth: { username: this.client_id, password: this.client_secret } }
            )
            .then((res) => {
                this.access_token = res.data.access_token;
                return res.data;
            });
    }
}
