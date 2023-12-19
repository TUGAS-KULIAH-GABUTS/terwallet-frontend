import { type IRootModel } from './rootModel'

export interface IIncomeModel extends IRootModel {
  incomeId: string
  incomeName: string
  incomeNominal: string
}
