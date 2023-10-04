/* eslint-disable array-callback-return */
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import {
  Form,
  useLoaderData,
  useSubmit,
  useTransition,
  useActionData
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { API } from '~/services/api'
import { checkSession } from '~/services/session'
import type { TableHeader } from '~/components/Table'
import { Table } from '~/components/Table'
import { CONFIG } from '~/config'
import { CONSOLE } from '~/utilities/log'
import { Modal } from '~/components/Modal'
import { Breadcrumb } from '~/components/breadcrumb'
import { convertTime } from '~/utilities/convertTime'
import type { ISessionModel } from '~/models/sessionModel'
import moment from 'moment'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { type IDhtSensorModel } from '~/models/dhtSensorModel'

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: any = await checkSession(request)
  if (!session) return redirect('/login')

  let url = new URL(request.url)
  let search = url.searchParams.get('search') || ''
  let size = url.searchParams.get('size') || 10
  let page = url.searchParams.get('page') || 0
  let range = url.searchParams.get('range') || 'all'

  let start = url.searchParams.get('start') || ''
  let end = url.searchParams.get('end') || ''

  try {
    const result = await API.getTableData({
      session: session,
      url: CONFIG.baseUrlApi + '/dht-sensors/list',
      pagination: true,
      page: +page || 0,
      size: +size || 10,
      filters: {
        search: search || '',
        start,
        end,
        range
      }
    })
    return {
      table: {
        link: 'data-sensors',
        data: result,
        page: page,
        size: size,
        filter: {
          search: search,
          start,
          end,
          range
        }
      },
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
    CONSOLE.log(error)
    return { ...error, isError: true }
  }
}

export default function Index(): ReactElement {
  const loader = useLoaderData()
  const session: ISessionModel = loader.session
  const submit = useSubmit()
  const transition = useTransition()
  const [mobileActionDropDown, setMobileActionDropdown] = useState<number | null>()
  const [modalDelete, setModalDelete] = useState(false)
  const [modalData, setModalData] = useState<IDhtSensorModel>()
  const actionData = useActionData()

  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [openModalDateTimePicker, setOpenModalDateTimePicker] = useState(false)

  console.log(start)
  console.log(end)

  const convertTimeToIso = (time: any) => {
    const date = new Date(time)
    return date.toISOString()
  }

  useEffect(() => {
    setMobileActionDropdown(null)
  }, [])

  console.log(loader)
  if (loader.isError) {
    return (
      <h1 className="text-center font-bold text-3xl text-red-600">
        {loader.error?.messsage || `error ${loader.code || ''}`}
      </h1>
    )
  }

  const submitDeleteData = async (e: React.FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { method: 'delete', action: `/admin` })
    setModalDelete(false)
  }

  const navigation = [{ title: 'Daftar', href: '', active: true }]

  const downloadData = async () => {
    try {
      const result = await axios.get(`${loader.API.baseUrl}/dht-sensors/list`, {
        auth: {
          username: loader.API.authorization.username,
          password: loader.API.authorization.password
        }
      })

      console.log(result)

      let xlsRows: any[] = []
      await result.data.data.items.map((value: IDhtSensorModel) => {
        let documentItem = {
          dhtSensorTemperature: value.dhtSensorTemperature,
          dhtSensorHumidity: value.dhtSensorHumidity,
          createdAt: convertTime(value.createdAt)
        }
        xlsRows.push(documentItem)
      })

      let xlsHeader = ['Temperature', 'Humidity', 'Tgl Dibuat']
      let createXLSLFormatObj = []
      createXLSLFormatObj.push(xlsHeader)
      xlsRows.map((value: IDhtSensorModel, i): void => {
        let innerRowData = []
        innerRowData.push(value.dhtSensorTemperature)
        innerRowData.push(value.dhtSensorHumidity)
        innerRowData.push(value.createdAt)
        createXLSLFormatObj.push(innerRowData)
      })

      /* File Name */
      let filename = `Data Sensor ${moment().format('DD-MM-YYYY')}.xlsx`

      /* Sheet Name */
      let ws_name = 'Sheet1'
      if (typeof console !== 'undefined') console.log(new Date())
      let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj)

      XLSX.utils.book_append_sheet(wb, ws, ws_name)
      XLSX.writeFile(wb, filename)
    } catch (error: any) {
      alert(error.message)
      console.log(error)
    }
  }

  const header: TableHeader[] = [
    {
      title: 'No',
      data: (data: IDhtSensorModel, index: number): ReactElement => (
        <td key={index + '-no'} className="md:px-6 md:py-3">
          {index + 1}
        </td>
      )
    },

    {
      title: 'Temperature',
      data: (data: IDhtSensorModel, index: number): ReactElement => (
        <td key={index + 'temperature'} className="md:px-6 md:py-3">
          {data.dhtSensorTemperature}&deg;C
        </td>
      )
    },
    {
      title: 'Humidity',
      data: (data: IDhtSensorModel, index: number): ReactElement => (
        <td key={index + 'humidity'} className="md:px-6 md:py-3">
          {data.dhtSensorHumidity} %
        </td>
      )
    },
    {
      title: 'Di buat pada',
      data: (data: IDhtSensorModel, index: number): ReactElement => (
        <td key={index + 'createdAt'} className="md:px-6 md:py-3">
          {convertTime(data.createdAt)}
        </td>
      )
    }
  ]

  if (session.adminRole === 'superAdmin') {
    header.push({
      title: 'Aksi',
      action: true,
      data: (data: IDhtSensorModel, index: number): ReactElement => (
        <td key={index + 'action'} className="md:px-6 md:py-3">
          {/* Desktop only  */}
          <div className="hidden md:block w-64">
            <button
              onClick={() => {
                setModalData(data)
                setModalDelete(true)
              }}
              className="bg-transparent m-1 hover:bg-red-500 text-red-700 hover:text-white py-1 px-2 border border-red-500 hover:border-transparent rounded"
            >
              Hapus
            </button>
          </div>
          {/* Mobile only  */}
          <div className="block md:hidden relative">
            <button
              id={`dropdownButton-${index}`}
              onClick={() => {
                if (index == mobileActionDropDown) {
                  setMobileActionDropdown(null)
                } else {
                  setMobileActionDropdown(index)
                }
              }}
              data-dropdown-toggle={`dropdown-${index}`}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>
            <div
              id={`dropdown-${index}`}
              className={`${
                mobileActionDropDown == index ? 'absolute right-0' : 'hidden'
              } z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-white`}
            >
              <ul className="py-1" aria-labelledby={`dropdownButton-${index}`}>
                <li>
                  <button
                    onClick={() => {
                      setModalData(data)
                      setModalDelete(true)
                    }}
                    className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-800 dark:hover:text-white"
                  >
                    Hapus
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </td>
      )
    })
  }

  return (
    <div className="">
      <Breadcrumb title="Data Sensor" navigation={navigation} />

      {actionData?.isError && (
        <div className="p-4 my-5 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error</span> {actionData.message}
        </div>
      )}

      <Form
        onChange={(e: any) =>
          submit(e.currentTarget, { action: `${loader?.table?.link}` })
        }
        method="get"
      >
        <div className="flex flex-col md:flex-row justify-between mb-2 md:px-0">
          <div className="px-1 w-full mb-2 flex gap-5 flex-row justify-between md:justify-start">
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

            <button
              type="button"
              onClick={downloadData}
              className="bg-transparent hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-2 px-4 border border-teal-500 hover:border-transparent rounded"
            >
              Export
            </button>

            <select
              name="range"
              defaultValue={loader?.table?.filter.range}
              className="block w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            >
              <option value="all">Semua</option>
              <option value="today">Hari ini</option>
              <option value="yesterday">Kemarin</option>
              <option value="week">Minggu ini</option>
              <option value="month">Bulan ini</option>
              <option value="year">Tahun ini</option>
            </select>
            <button
              className="bg-teal-500 text-white active:bg-teal-400 font-bold text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => setOpenModalDateTimePicker(true)}
            >
              Filter By Date
            </button>
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

      <Modal
        open={openModalDateTimePicker}
        setOpen={() => {
          setOpenModalDateTimePicker(false)
        }}
      >
        <Form
          method="get"
          onSubmit={(e: any) => {
            submit(e.currentTarget, { action: `${loader?.table?.link}` })
            setOpenModalDateTimePicker(false)
            setStart('')
            setEnd('')
          }}
        >
          <input className="hidden" name="start" defaultValue={start} />
          <input className="hidden" name="end" defaultValue={end} />
          <div className="flex items-center justify-between gap-5">
            <div
              className="datepicker relative form-floating xl:w-96"
              data-mdb-toggle-button="false"
            >
              <p className="text-center text-gray-500">Start</p>
              <input
                type="date"
                className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Select a date"
                onChange={(e) => setStart(convertTimeToIso(e.target.value))}
              />
            </div>
            <div
              className="datepicker relative form-floating xl:w-96"
              data-mdb-toggle-button="false"
            >
              <p className="text-center text-gray-500">End</p>
              <input
                type="date"
                className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Select a date"
                onChange={(e) => setEnd(convertTimeToIso(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-5 md:flex-row mt-4">
            <button
              type="button"
              className="inline-flex ml-0 md:ml-2 justify-center w-full rounded-md border border-gray shadow-sm px-4 py-2 bg-white text-base font-medium text-gray hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray sm:text-sm"
              onClick={() => {
                setOpenModalDateTimePicker(false)
              }}
            >
              cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
            >
              search
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={modalDelete}
        setOpen={() => {
          setModalDelete(false)
        }}
      >
        <Form method="delete" onSubmit={submitDeleteData}>
          <input
            className="hidden"
            name="dhtSensorId"
            defaultValue={modalData?.dhtSensorId}
          />
          Apakah Anda yakin ingin menghapus data tersebut?
          <div className="flex flex-col md:flex-row mt-4">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
            >
              {transition?.submission ? 'Menghapus...' : 'Hapus'}
            </button>
            <button
              type="button"
              className="inline-flex ml-0 md:ml-2 justify-center w-full rounded-md border border-gray shadow-sm px-4 py-2 bg-white text-base font-medium text-gray hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray sm:text-sm"
              onClick={() => {
                setModalDelete(false)
              }}
            >
              Batalkan
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

// interface DateTimePickerProps {
//   title: string
//   start: any
//   end: any
//   save: any
// }

// function DateTimePickerStyle({ title, start, end, save }: DateTimePickerProps) {
//   const [showModal, setShowModal] = useState(false)

//   const openModal = () => {
//     setShowModal(!showModal)
//   }

//   const handleOnSave = () => {
//     save()
//     setShowModal(false)
//   }

//   return (
//     <>
//       <button
//         className="bg-teal-500 text-white active:bg-teal-400 font-bold text-sm px-2 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//         type="button"
//         onClick={openModal}
//       >
//         {title}
//       </button>
//       {showModal ? (
//         <>
//           <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
//             <div className="relative mt-10 mx-auto max-w-2xl">
//               {/*content*/}
//               <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-96 h-56 bg-white outline-none focus:outline-none">
//                 {/*body*/}
//                 <div className="relative p-6 flex-auto">
//                   <div className="flex items-center justify-between">
//                     <div
//                       className="datepicker relative form-floating xl:w-96"
//                       data-mdb-toggle-button="false"
//                     >
//                       <p className="text-center text-gray-500">Start</p>
//                       <input
//                         type="date"
//                         className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
//                         placeholder="Select a date"
//                         onChange={(e) => start(e.target.value)}
//                       />
//                     </div>
//                     <div
//                       className="datepicker relative form-floating xl:w-96"
//                       data-mdb-toggle-button="false"
//                     >
//                       <p className="text-center text-gray-500">End</p>
//                       <input
//                         type="date"
//                         className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
//                         placeholder="Select a date"
//                         onChange={(e) => end(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {/*footer*/}
//                 <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
//                   <button
//                     className="bg-transparent mx-2 hover:bg-teal-500 text-teal-700 font-semibold hover:text-white py-1 px-5 border border-teal-500 hover:border-transparent rounded"
//                     type="button"
//                     onClick={openModal}
//                   >
//                     Close
//                   </button>
//                   <button
//                     className="bg-teal-500 mx-2 text-white font-semibold py-1 px-5 hover:bg-teal-400 rounded"
//                     type="submit"
//                     onClick={handleOnSave}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="opacity-5 fixed inset-0 z-40 bg-black"></div>
//         </>
//       ) : null}
//     </>
//   )
// }
