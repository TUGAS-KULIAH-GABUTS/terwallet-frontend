import type { ReactElement } from 'react'

import { Form, useLoaderData, useSubmit } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { API } from '~/services/api'
import { checkSession } from '~/services/session'
import type { TableHeader } from '~/components/Table'
import { Table } from '~/components/Table'
import { CONFIG } from '~/config'
import { CONSOLE } from '~/utilities/log'
import { Breadcrumb } from '~/components/breadcrumb'
import { convertTime } from '~/utilities/convertTime'
import type { IReportModel } from '~/models/reports'

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: any = await checkSession(request)
  if (!session) return redirect('/login')

  let url = new URL(request.url)
  let search = url.searchParams.get('search') || ''
  let size = url.searchParams.get('size') || 10
  let page = url.searchParams.get('page') || 0

  try {
    const result = await API.getTableData({
      session: session,
      url: CONFIG.baseUrlApi + '/reports',
      pagination: true,
      page: +page || 0,
      size: +size || 10,
      filters: {
        search: search || ''
      }
    })
    return {
      table: {
        link: 'reports',
        data: result,
        page: page,
        size: size,
        filter: {
          search: search
        }
      },
      session: session,
      isError: false
    }
  } catch (error: any) {
    CONSOLE.log(error)
    return { ...error, isError: true }
  }
}

export default function Index(): ReactElement {
  const loader = useLoaderData()
  const submit = useSubmit()

  console.log(loader)
  if (loader.isError) {
    return (
      <h1 className="text-center font-bold text-3xl text-red-600">
        {loader.error?.messsage || `error ${loader.code || ''}`}
      </h1>
    )
  }

  const navigation = [{ title: 'List', href: '', active: true }]

  const header: TableHeader[] = [
    {
      title: 'No',
      data: (data: IReportModel, index: number): ReactElement => (
        <td key={index + 'no'} className="md:px-6 md:py-3">
          {index + 1}
        </td>
      )
    },
    {
      title: 'Nama',
      data: (data: IReportModel, index: number): ReactElement => (
        <td key={index + 'report name'} className="md:px-6 md:py-3">
          {data.reportName}
        </td>
      )
    },
    {
      title: 'Income',
      data: (data: IReportModel, index: number): ReactElement => (
        <td key={index + 'incomeNominal'} className="md:px-6 md:py-3">
          {data.reportIncome}
        </td>
      )
    },
    {
      title: 'Expense',
      data: (data: IReportModel, index: number): ReactElement => (
        <td key={index + 'expense'} className="md:px-6 md:py-3">
          {data.reportExpense}
        </td>
      )
    },
    {
      title: 'Di buat pada',
      data: (data: IReportModel, index: number): ReactElement => (
        <td key={index + 'createdAt'} className="md:px-6 md:py-3">
          {convertTime(data.createdAt)}
        </td>
      )
    }
  ]

  return (
    <div className="">
      <Breadcrumb title="Reports" navigation={navigation} />

      <Form
        onChange={(e: any) =>
          submit(e.currentTarget, { action: `${loader?.table?.link}` })
        }
        method="get"
      >
        <div className="flex flex-col md:flex-row justify-between mb-2 md:px-0">
          <div className="px-1 w-full mb-2 flex flex-row justify-between md:justify-start">
            <select
              name="size"
              defaultValue={loader?.table?.size}
              className="block w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="w-full mb-2 md:w-1/5">
            <input
              defaultValue={loader?.table?.filter.search}
              name="search"
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
              placeholder="Cari data"
              type="text"
            />
          </div>
        </div>
      </Form>

      <Table header={header} table={loader.table} />
    </div>
  )
}
