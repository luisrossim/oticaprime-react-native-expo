import { FormaPagamento } from "@/models/formaPagamento";
import { AxiosService } from "./axios-service";

export class FormasPagamentoService extends AxiosService<FormaPagamento> {
    constructor(token?: string) {
        super('/formas-pagamento', token);
    }
}