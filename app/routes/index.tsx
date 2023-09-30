import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { Breadcrumb } from '~/components/breadcrumb'
import { checkSession } from '~/services/session'
import { CONFIG } from '~/config'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { convertTime } from '~/utilities/convertTime'
import { useEffect, useState } from 'react'
import axios from 'axios'

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: any = await checkSession(request)
  if (!session) return redirect('/login')
  try {
    return {
      API: {
        baseUrl: CONFIG.baseUrlApi,
        authorization: {
          username: CONFIG.authorization.username,
          password: CONFIG.authorization.passsword
        }
      },
      session: session,
      isError: false
    }
  } catch (error: any) {
    console.log(error)
    return { ...error, isError: true }
  }
}

interface ITemperatureType {
  temperature: number
  time: string
}

interface IHumidityType {
  humidity: number
  time: string
}

export default function Index() {
  const loader = useLoaderData()

  const [temperatureList, setTemperatureList] = useState<ITemperatureType[]>([])
  const [humidityList, setHumidityList] = useState<IHumidityType[]>([])

  console.log(loader)

  useEffect(() => {
    const getData = async () => {
      const temperatureData = await axios.get(
        `${loader.API.baseUrl}/dht-sensors/statistic/temperature`,
        {
          auth: {
            username: loader.API.authorization.username,
            password: loader.API.authorization.password
          }
        }
      )

      const humidityData = await axios.get(
        `${loader.API.baseUrl}/dht-sensors/statistic/humidity`,
        {
          auth: {
            username: loader.API.authorization.username,
            password: loader.API.authorization.password
          }
        }
      )

      const temperatureList = temperatureData.data.data.map((item: any) => {
        return {
          temperature: item.dhtSensorTemperature,
          time: convertTime(item.createdAt)
        }
      }) as ITemperatureType[]

      const humidityList = humidityData.data.data.map((item: any) => {
        return {
          humidity: item.dhtSensorHumidity,
          time: convertTime(item.createdAt)
        }
      }) as IHumidityType[]

      setTemperatureList(temperatureList)
      setHumidityList(humidityList)

      console.log('_________')
    }

    const interval = setInterval(getData, 5000)
    return () => clearInterval(interval)
  }, [loader?.humidity, loader?.temperature])

  if (loader.isError) {
    return (
      <h1 className="text-center font-bold text-xl text-red-600">
        {loader.message || `Error ${loader.code || ''}!`}
      </h1>
    )
  }

  const navigation = [{ title: 'Dashboard', href: '', active: true }]

  return (
    <div>
      <Breadcrumb title="Dashboard" navigation={navigation} />
      <div className="flex w-full flex-row justify-between bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="w-1/2 md:w-full">
          <h1 className="text-2xl font-medium text-gray-800 w-82">
            Halo, {loader.session.adminName}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap my-5 gap-5">
        <Card>
          <p className="font-extrabold text-center">SUHU</p>
          <div className="flex justify-center h-56 items-center">
            <h1 className="font-extrabold text-4xl text-center">
              {temperatureList[temperatureList.length - 1]?.temperature}&deg;C
            </h1>
          </div>
        </Card>
        <div className="p-5 rounded-lg shadow bg-white">
          {temperatureList.length > 0 && (
            <AreaChart
              width={600}
              height={300}
              data={temperatureList}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          )}
        </div>
      </div>

      {humidityList && (
        <div className="flex flex-wrap my-5 gap-5">
          <div className="p-5 rounded-lg shadow bg-white">
            <AreaChart
              width={600}
              height={300}
              data={humidityList}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="humidity" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </div>
          <Card>
            <p className="font-extrabold text-center">KELEMBAPAN</p>
            <div className="flex justify-center h-56 items-center">
              <h1 className="font-extrabold text-4xl text-center">
                {humidityList[humidityList.length - 1]?.humidity}%
              </h1>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

const Card = ({ children, className }: { children: any; className?: string }) => (
  <div
    className={`${className} w-full md:max-w-xs p-6 bg-white border rounded-lg shadow`}
  >
    {children}
  </div>
)
