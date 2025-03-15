import { AxiosService } from "./axios-service";
import { Company, EmpresaReports } from "@/models/company";

export class EmpresaService extends AxiosService<Company> {
    constructor(token?: string) {
        super('/empresa', token);
    }

    async getReports(params: Record<string, any>): Promise<EmpresaReports> {
        const response = await this.api.get<EmpresaReports>(`${this.path}/relatorio`, { params });
        return response.data;
    }
}