export class UtilitiesService {

    static formatarValor(valor: number): string {
        return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

}