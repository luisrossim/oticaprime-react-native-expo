import { Pageable } from "./pageable"

export interface ProcessosLiberados {
  CODIGO: number
  NOME_USU: string
  DATA_HORA: number
  TIPO_MOVIMENTO: string
  HISTORICO: string
}

export interface ProcessosLiberadosPaginados {
  processos: ProcessosLiberados[]
  pageable: Pageable
}