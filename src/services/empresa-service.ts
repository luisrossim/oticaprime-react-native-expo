import { AxiosService } from "./axios-service";
import { Company, EmpresaReports } from "@/models/company";

export class EmpresaService extends AxiosService<Company> {
    constructor() {
        super('/empresa');
    }

    async getReports(id: number | string): Promise<EmpresaReports> {
        const response = await this.api.get<EmpresaReports>(`${this.path}/relatorio/${id}`);
        return response.data;
    }
}