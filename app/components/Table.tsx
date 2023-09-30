/* eslint-disable array-callback-return */
import { Link } from '@remix-run/react'
import { objectToQueryString } from '~/utilities'

export interface TableDataAttributes {
  items: any[]
  total_items: number
  total_pages: number
  current_page: number
}

export interface TableAttributes {
  link: string | ''
  data: TableDataAttributes
  page: number
  size: number
  filter: Object
}

export interface TableHeader {
  data: string | Function
  action?: boolean | false
  title: string
}

export const Table = ({
  header,
  table
}: {
  header: TableHeader[]
  table: TableAttributes
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {/* Desktop only  */}
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg hidden md:block">
              <table className="min-w-full divide-y overflow-scroll divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {header?.map((value: any, i: number): any => {
                      if (value) {
                        return (
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            key={i}
                          >
                            {value.title}
                          </th>
                        )
                      }
                    })}
                  </tr>
                </thead>
                <tbody>
                  {table.data.items?.map((value: any, i: number) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {header.map((head, j) => {
                        if (typeof head.data !== 'string') {
                          return head.data(value, i)
                        } else {
                          if (value[head.data]) {
                            return (
                              <td
                                key={j}
                                className="hidden md:block px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
                              >
                                {value[head.data]}
                              </td>
                            )
                          } else {
                            return (
                              <td
                                key={j}
                                className="hidden md:block px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
                              ></td>
                            )
                          }
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {table.data.items.length < 1 ? (
              <div className="bg-white w-full text-center text-gray-500 p-4 rounded-lg">
                Data tidak ditemukan
              </div>
            ) : (
              ''
            )}
            {/* Mobile only  */}
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg block md:hidden">
              {table.data.items?.map((value: any, i: number) => (
                <div key={i} className={`my-2 bg-gray-300 pr-2 pb-2 rounded-lg`}>
                  <div className="bg-white rounded-lg">
                    <div className={`flex justify-end px-4 pt-2`}>
                      {header.map((head, j) => {
                        if (head.action && typeof head.data == 'function') {
                          return head.data(value, i)
                        } else {
                          return ''
                        }
                      })}
                    </div>
                    <div className="px-4 pb-4 divide-y flex flex-col justify-between">
                      {header.map((head, j): any => {
                        if (!head.action) {
                          if (typeof head.data !== 'string') {
                            return head.data(value, i)
                          } else {
                            if (value[head.data]) {
                              return (
                                <div
                                  key={i + j}
                                  className="block md:hidden columns-2  break-all"
                                >
                                  <p>{head.title}</p>
                                  <p className="break-inside-avoid-column">
                                    {value[head.data]}
                                  </p>
                                </div>
                              )
                            } else {
                              return (
                                <div
                                  key={j + i}
                                  className="block md:hidden columns-2  break-all"
                                >
                                  <p>{head.title}</p>
                                  <p className="break-inside-avoid-column">-</p>
                                </div>
                              )
                            }
                          }
                        }
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg">
              <Pagination table={table} />
              <div>
                {table.data.items.length} dari {table.data.total_items}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const setVisiblePages = (
  visibleRadius: number,
  currentPage: number,
  maxPages: number
) => {
  const visiblePages = []

  let start = currentPage - visibleRadius
  let end = currentPage + visibleRadius

  if (currentPage <= maxPages) {
    start = currentPage
    end = currentPage + visibleRadius * 2
  }

  if (currentPage >= maxPages - 3) {
    start = currentPage
    end = currentPage + visibleRadius * 2
  }

  if (start < 2) {
    start = 1
    end = start + visibleRadius * 2
  }
  if (end >= maxPages) {
    start = maxPages - visibleRadius * 2
    end = maxPages
  }
  if (visibleRadius * 4 > maxPages) {
    start = 1
    end = maxPages
  }
  for (let i = start; i <= end; i++) {
    visiblePages.push(i)
  }
  return visiblePages
}

export const Pagination = ({ table }: { table: any }) => {
  let visiblePages = setVisiblePages(1, table.data.current_page, table.data.total_pages)
  const filters = objectToQueryString(table.filter)
  const pagesComponents = []
  if (visiblePages[0] >= 2) {
    pagesComponents.push(
      <Link to={`/${table.link}?page=0&size=${table.size}&${filters}`}>
        <button className="z-10 bg-white border-teal-500 text-teal-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          1
        </button>
      </Link>
    )
    pagesComponents.push(
      <span className="relative inline-flex items-center px-4 py-2 border border-teal-500 bg-white text-sm font-medium text-teal-500">
        ...
      </span>
    )
  }
  visiblePages.map((page, index) =>
    pagesComponents.push(
      <Link to={`/${table.link}?page=${page - 1}&size=${table.size}&${filters}`}>
        <button
          key={`${index}-center`}
          className={`z-10 ${
            table.data.current_page + 1 == page
              ? 'bg-teal-200 border-teal-500'
              : 'bg-whitw-50 border-teal-500'
          }  text-teal-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
        >
          {page}
        </button>
      </Link>
    )
  )
  if (table.data.current_page <= table.data.total_pages - 3) {
    if (table.data.current_page <= table.data.total_pages - 3) {
      pagesComponents.push(
        <span className="relative inline-flex items-center px-4 py-2 border border-teal-500 bg-white text-sm font-medium text-teal-500">
          ...
        </span>
      )
    }
    pagesComponents.push(
      <Link
        to={`/${table.link}?page=${table.data.total_pages - 1}&size=${
          table.size
        }&${filters}`}
      >
        <button className="relative inline-flex items-center px-4 py-2 border border-teal-500 bg-white text-sm font-medium text-teal-500">
          {table.data.total_pages}
        </button>
      </Link>
    )
  }
  return (
    <div>
      <div className="flex-1 flex justify-start sm:hidden">
        {table.page != 0 ? (
          <Link
            to={`/${table.link}?page=${table.page != 0 ? table.page - 1 : 0}&size=${
              table.size
            }&${filters}`}
          >
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Sebelumnya
            </button>
          </Link>
        ) : (
          ''
        )}
        {table.page != table.data.total_pages - 1 ? (
          <Link
            to={`/${table.link}?page=${
              +table.page != +table.data.total_pages - 1
                ? +table.page + 1
                : +table.data.total_pages - 1
            }&size=${table.size}&${filters}`}
          >
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Selanjutnya
            </button>
          </Link>
        ) : (
          ''
        )}
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            {pagesComponents?.map((value, index) => (
              <div key={index}>{value}</div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
