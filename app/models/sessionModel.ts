export interface ISessionModel {
  adminId: string
  adminName: string
  adminEmail: string
  adminRole: 'admin' | 'superAdmin'
  session: string
  sessionExpiredOn: number
}
