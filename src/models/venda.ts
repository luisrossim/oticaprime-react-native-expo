import { Pageable } from "./pageable"

export interface Venda {
    COD_VEN: number
    DATA_VEN: string
    NOME_VEND: string
    NOME_CLI: string
    NOME_MEDICO: string
    RAZAO_EMP: string
    NOME_TPV: string
    TOTAL_VEN: number
    FORMAS_PAGAMENTO: FormaPagamentoVenda[]
    ITENS: ItemVenda[]
}

export interface VendaSummary {
    COD_VEN: number
    DATA_VEN: string
    NOME_VEND: string
    NOME_CLI: string
    NOME_MEDICO: string
    RAZAO_EMP: string
    NOME_TPV: string
    TOTAL_VEN: number
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

export interface FormaPagamentoVenda {
    VALOR: number
    DESCRICAO: string
}

export interface VendasPaginadas {
    vendas: VendaSummary[]
    pageable: Pageable
}