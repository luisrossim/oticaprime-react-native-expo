import { Recebimento, RecebimentoPageable } from "@/models/recebimento";
import { AxiosService } from "./axios-service";

export class RecebimentosService extends AxiosService<Recebimento> {

    constructor(token?: string) {
        super('/recebimentos', token);
    }

    async getWithPageable(params: Record<string, any>): Promise<RecebimentoPageable> {
        const response = await this.api.get<RecebimentoPageable>(this.path, { params });
        return response.data;
    }
}