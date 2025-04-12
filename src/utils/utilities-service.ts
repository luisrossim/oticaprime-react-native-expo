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

    static handleEmpresaName = (razaoSocial: string): string => {
        const match = razaoSocial.match(/(?:OTICO)\s+(.+)/i);
        
        if (match) {
            let nome = match[1];
        
            if (nome.length > 18) {
            nome = nome.substring(0, 18) + ".";
            }
            return nome;
        }
        
        return "Nenhuma empresa";
    };

    static handleCaixaName = (nome: string): string => {
        const res = (nome?.includes("COFRE") ? "CAIXA 2" : "CAIXA 1")
        return res;
    }

    static formatDateToUpper = (dateStr: string): string => {
        const [day, month, year] = dateStr.split("/");
      
        const monthIndex = parseInt(month, 10) - 1;
        const monthName = this.monthNamesUpper[monthIndex];
      
        return `${day} ${monthName} ${year}`;
      };
}