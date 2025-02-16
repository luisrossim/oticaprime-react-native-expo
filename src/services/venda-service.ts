import { Venda } from "@/models/venda";
import { AxiosService } from "./axios-service";

export class VendaService extends AxiosService<Venda> {
    constructor() {
        super('http://192.168.1.173:3000/api', '/venda');
    }
}