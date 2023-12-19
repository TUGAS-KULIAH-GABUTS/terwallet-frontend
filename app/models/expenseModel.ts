import { type IRootModel } from './rootModel'

export interface IExpenseModel extends IRootModel {
  expenseId: string
  expenseName: string
  expenseNominal: string
}
