import type { IRootModel } from './rootModel'

export interface IDhtSensorModel extends IRootModel {
  dhtSensorId: string
  dhtSensorTemperature: number
  dhtSensorHumidity: number
}
