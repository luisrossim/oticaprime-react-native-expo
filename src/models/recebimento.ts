import { Pageable } from "./pageable.js";

export interface RecebimentoSummary {
    COD_CTR: number
    COD_EMP: number
    COD_CAI?: number
    COD_VENDA: number
    COD_CLI: number
    VENCTO_CTR: string
    DTPAGTO_CTR?: string
    VALOR_CTR: number
    VLRPAGO_CTR?: number
    NUMDOCUMENTO_CTR: string
    COD_BAIXA?: number
    DATA_BAIXA?: string
    ACRESCIMO_RECEBIDO?: number
    DESCONTO_CONCEDIDO?: number
    VALOR_RECEBIDO?: number
}

export interface RecebimentoPageable {
    registros: RecebimentoSummary[],
    pageable: Pageable
}
