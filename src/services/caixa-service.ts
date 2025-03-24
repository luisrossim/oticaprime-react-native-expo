import { AxiosService } from "./axios-service";
import { Caixa, CaixaAnaliticoPaginado, CaixaDetails } from "@/models/caixa";

export class CaixaService extends AxiosService<Caixa> {

    constructor(token?: string) {
        super('/caixa', token);
    }

    async getCaixaDetails(params: Record<string, any>): Promise<CaixaDetails> {
        const response = await this.api.get<CaixaDetails>(`${this.path}/details`, { params });
        return response.data;
    }

    async getCaixaAnalitico(params: Record<string, any>): Promise<CaixaAnaliticoPaginado> {
        const response = await this.api.get<CaixaAnaliticoPaginado>(`${this.path}/analitico`, { params });
        return response.data;
    }
}