import { ProcessosLiberados, ProcessosLiberadosPaginados } from "@/models/processosLiberados";
import { AxiosService } from "./axios-service";

export class ProcessosLiberadosService extends AxiosService<ProcessosLiberados> {
    constructor(token?: string) {
        super('/processos-liberados', token);
    }

    async getWithPageable(params: Record<string, any>): Promise<ProcessosLiberadosPaginados> {
        const response = await this.api.get<ProcessosLiberadosPaginados>(this.path, { params });
        return response.data;
    }
}