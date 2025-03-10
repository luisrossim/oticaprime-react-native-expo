import { Caixa } from "./caixa"

export interface Company {
    COD_EMP: number,
    RAZAO_EMP: string  
}

export interface EmpresaReports {
    empresa: Company
    totalVendasMensal: TotalVendasMensal[]
    formaPagamentoMensal: FormaPagamentoMensal[]
}

interface TotalVendasMensal {
    ANO: number
    MES: number
    TOTAL_VENDAS: number,
    QUANTIDADE_VENDAS: number
}

interface FormaPagamentoMensal {
    ANO: number
    MES: number
    formasPagamento: FormaPagamentoQuantidade[]
}

interface FormaPagamentoQuantidade {
    nome: string
    quantidade: number
}

export interface selectedEmpresaCaixa {
    empresa: Company,
    caixa: Caixa
}