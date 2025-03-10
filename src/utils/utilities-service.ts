import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

export class UtilitiesService {

    static formatarValor(valor: number): string {
        return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    static generateSublabel(range: number): string {
        const startDate = startOfMonth(subMonths(new Date(), range));
        const endDate = endOfMonth(subMonths(new Date(), 1));
        return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
    };

    static monthNames = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    static formatarData = (data: Date): string => {
        return data.toLocaleDateString();
    };

}