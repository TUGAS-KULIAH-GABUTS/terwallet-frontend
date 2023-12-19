import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { Breadcrumb } from '~/components/breadcrumb'
import { checkSession } from '~/services/session'
import { CONFIG } from '~/config'
import { PieChart, Pie, Cell } from 'recharts'

import { API } from '~/services/api'
import { convertNumberToCurrency } from '~/utilities/convertNumberToCurrency'

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 }
]

const COLORS = ['#0088FE', '#00C49F']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: any = await checkSession(request)
  if (!session) return redirect('/login')
  const statistic = await API.get(session, CONFIG.baseUrlApi + `/statistic`)
  try {
    return {
      statistic,
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

export default function Index() {
  const loader = useLoaderData()

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
          <p className="font-extrabold text-center">Saldo</p>
          <div className="flex justify-center h-56 items-center">
            <h1 className="font-extrabold text-4xl text-center">
              Rp{convertNumberToCurrency(loader?.statistic.statisticSaldo)}
            </h1>
          </div>
        </Card>
        <div className="p-5 rounded-lg shadow bg-white">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p>income</p>
              <div className="p-2 w-16" style={{ backgroundColor: '#0088FE' }}></div>
            </div>
            <div className="flex gap-2">
              <p>expense</p>
              <div className="p-2 w-16" style={{ backgroundColor: '#00C49F' }}></div>
            </div>
          </div>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>
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
