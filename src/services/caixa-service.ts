import { AxiosService } from "./axios-service";
import { Caixa } from "@/models/caixa";

export class CaixaService extends AxiosService<Caixa> {
    constructor() {
        super('/caixa');
    }
}