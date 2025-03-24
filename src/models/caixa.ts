import { Pageable } from "./pageable"

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

export interface CaixaLancamentosHistorico {
    CODIGO: number
    NOME_USU: string
    DATA: string
    HISTORICO: string
    VALOR: number
    DEB_CRED: string
    FLAG_SOMAR: string
    COD_BAIXA_CREDIARIO: number
    COD_VENDA: number
    TIPO_MOVIMENTO: string
}

export interface CaixaSaldo {
    credito: number
    debito: number 
    saldo: number
}

export interface CaixaAnalitico {
    historico: CaixaLancamentosHistorico[]
    saldoAnterior: CaixaSaldo
    saldoAtual: CaixaSaldo
    saldoFinal: number
}

export interface CaixaAnaliticoPaginado {
    analitico: CaixaAnalitico
    pageable: Pageable
}
