import axios, { Axios, Method } from 'axios';
import buildUrl from 'build-url-ts';

export abstract class NaverLandClientAbstract {
    protected axios: Axios;

    protected constructor(baseURL: string) {
        this.axios = axios.create({
            baseURL,
        });
    }

    protected async call<T>({
        method,
        path,
        queryParams,
    }: {
        method: Method;
        path: string;
        queryParams: Record<string, any>;
    }) {
        const response = await this.axios.request<T>({
            method,
            url: buildUrl({
                path,
                queryParams,
            }),
        });

        return response.data;
    }
}
