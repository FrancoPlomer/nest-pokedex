import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { httpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
export class AxiosAdapter implements httpAdapter {
    private axios: AxiosInstance = axios;

    async get<T = any>(url: string): Promise<T> {
        console.log('AxiosAdapter.get');

        try {
            const { data } = await this.axios.get<T>(url);

            return data;
        } catch (error) {
            console.log(error);

            throw new Error('Internal Server Error');
        }
    }

}