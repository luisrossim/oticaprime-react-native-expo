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

    static formatarData = (data: Date): string => {
        return data.toLocaleDateString();
    };

    static monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    static monthNamesUpper = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

    static ptBR = {
        monthNames: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
        today: "Hoje"
    };

    static getFirstLetter = (empresa?: string) => {
        if (empresa) {
          const words = empresa.split(' ');
          
          const primeIndex = words.findIndex(word => word.toLowerCase() === "prime");
          if (primeIndex !== -1 && words[primeIndex + 1]) {
            return words[primeIndex + 1].charAt(0).toUpperCase();
          }
      
          const oticoIndex = words.findIndex(word => word.toLowerCase() === "otico");
          if (oticoIndex !== -1 && words[oticoIndex + 1]) {
            return words[oticoIndex + 1].charAt(0).toUpperCase();
          }
      
          return words[0].charAt(0).toUpperCase();
        }
        return '';
    };
}