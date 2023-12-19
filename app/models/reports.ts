import { type IRootModel } from './rootModel'

export interface IReportModel extends IRootModel {
  reportId: string
  reportName: string
  reportIncome: number
  reportExpense: number
}
