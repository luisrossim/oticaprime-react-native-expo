import { AxiosService } from "./axios-service";
import { Company } from "@/models/company";

export class EmpresaService extends AxiosService<Company> {
    constructor() {
        super('http://192.168.1.7:3000/api', '/empresa');
    }
}