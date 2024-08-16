
export interface httpAdapter {
    //Esto queda por patron adaptador, por eso el tipo T
    get<T>( url: string ): Promise<T>;
}