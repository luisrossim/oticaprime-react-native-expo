import { AxiosService } from "./axios-service";
import { Company } from "@/models/company";

export class EmpresaService extends AxiosService<Company> {
    constructor() {
        super('/empresa');
    }
}