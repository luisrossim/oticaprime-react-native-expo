import { Venda, VendasPaginadas } from "@/models/venda";
import { AxiosService } from "./axios-service";

export class VendaService extends AxiosService<Venda> {
    constructor() {
        super('/venda');
    }

    async getWithPageable(params: Record<string, any>): Promise<VendasPaginadas> {
        const response = await this.api.get<VendasPaginadas>(this.path, { params });
        return response.data;
    }
}