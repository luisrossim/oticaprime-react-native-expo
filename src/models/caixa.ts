export interface Caixa {
    COD_CAI: number,
    COD_EMP: number,
    DESC_CAI: string
}

export interface CaixaDetails {
    CAIXA: Caixa
    FORMAS_PAGAMENTO: FormasPagamentoTotal[]
    TOTAL_BAIXAS: number
    TOTAL_RECEBIDO: number
    TOTAL_ACRESCIMO_RECEBIDO: number
    TOTAL_DESCONTO_CONCEDIDO: number
    TOTAL_CONTAS_RECEBER: number
    VENDAS: CaixaVendasDetails
}

export interface FormasPagamentoTotal {
    DESCRICAO: string
    QUANTIDADE: number
    VALOR_TOTAL: number
    DESCONTO_TOTAL?: number
}

export interface CaixaVendasDetails {
    TOTAL_VENDAS: number,
    TOTAL_VALOR_VENDAS: number,
    TOTAL_DESCONTO_VENDAS: number,
    TOTAL_VENDAS_CANCELADAS: number,
    TOTAL_CORTESIAS_OUTROS: number,
    FORMAS_PAGAMENTO_VENDAS: FormasPagamentoTotal[]
}
