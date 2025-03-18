export interface Company {
    COD_EMP: number,
    RAZAO_EMP: string  
}

export interface TotalVendasMensal {
    ANO: number,
    MES: number,
    TOTAL_VENDAS: number,
    QUANTIDADE_VENDAS: number
}

export interface EmpresaReports {
    empresa: Company
    totalVendasMensal: TotalVendasMensal[]
}
