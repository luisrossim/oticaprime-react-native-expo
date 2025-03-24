import { Pageable } from "./pageable"


export interface Recebimento extends RecebimentoSummary {
    COD_EMP: number
    COD_CAI: number
    COD_VENDA: number
    VENCTO_CTR: string
    VALOR_CTR: number
    DATA_BAIXA: string
    ACRESCIMO_RECEBIDO: number
    DESCONTO_CONCEDIDO: number
}

export interface RecebimentoSummary {
    COD_CTR: number
    SEQUENCIA_CTR: string
    NOME_CLI: string
    DTPAGTO_CTR: string
    VLRPAGO_CTR: number
    NUMDOCUMENTO_CTR: string
    COD_BAIXA: number
    VALOR_RECEBIDO: number
}

export interface RecebimentoPageable {
    registros: RecebimentoSummary[],
    pageable: Pageable
}

