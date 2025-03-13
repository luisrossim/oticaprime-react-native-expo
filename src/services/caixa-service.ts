import { AxiosService } from "./axios-service";
import { Caixa, CaixaDetails } from "@/models/caixa";

export class CaixaService extends AxiosService<Caixa> {

    constructor(token?: string) {
        super('/caixa', token);
    }

    async getCaixaDetails(params: Record<string, any>): Promise<CaixaDetails> {
        const response = await this.api.get<CaixaDetails>(`${this.path}/details`, { params });
        return response.data;
    }
}