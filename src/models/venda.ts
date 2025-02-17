export interface Venda {
    COD_VEN: number
    NOME_CLI: string
    NOME_VEND: string
    NOME_MEDICO: string
    NOME_TPV: string
    TOTAL_VEN: number
    DATA_VEN: string
}

export interface FormaPagamentoVenda {
    VALOR: number
    DESCRICAO: string
}

export interface ItemVenda {
    ORDEM: number
    QUANT: number
    VALOR: number
    DESCONTO: number
    VALOR_TOTAL: number
    NOME_PRO: string
    UNIDADE_MEDIDA: string
}