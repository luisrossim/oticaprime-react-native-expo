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

export interface AnaliseVendedoresMensal {
    ANO: number
    MES: number
    COD_VEND: number
    NOME_VEND: string
    TOTAL_VENDAS: number
    QUANTIDADE_VENDAS: number
}

export interface AnaliseVendedor {
    COD_VEND: number
    NOME_VEND: string
    TOTAL_VENDAS: number
    QUANTIDADE_VENDAS: number
}

export interface AnaliseAgrupada {
    ANO: number,
    MES: number,
    TOTAL_VENDAS: number,
    QUANTIDADE_VENDAS: number
    VENDEDORES: AnaliseVendedor[]
}

export interface EmpresaReports {
    empresa: Company
    relatorio: AnaliseAgrupada[]
}
