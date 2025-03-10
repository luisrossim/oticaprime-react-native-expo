export interface Caixa {
    COD_CAI: number,
    COD_EMP: number,
    DESC_CAI: string
}

export interface CaixaDetails {
    CAIXA: Caixa
    FORMAS_PAGAMENTO: CaixaFormasPagamento[]
    TOTAL_RECEBIDO: number
    TOTAL_ACRESCIMO_RECEBIDO: number
    TOTAL_DESCONTO_CONCEDIDO: number
    TOTAL_DESCONTO_VENDAS: number
    TOTAL_CONTAS_RECEBER: number
}

export interface CaixaFormasPagamento {
    DESCRICAO: string
    VALOR_TOTAL: number
}
