import type { IRootModel } from './rootModel'

export interface IAdminModel extends IRootModel {
  adminId: string
  adminName: string
  adminEmail: string
  adminPassword: string
  adminRole: 'admin' | 'superAdmin'
}

export interface IAdminCreateRequestModel {
  adminName: string
  adminEmail: string
  adminPassword: string
}
