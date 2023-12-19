import {
  HomeIcon,
  MenuAlt2Icon,
  XIcon,
  UserIcon,
  UserGroupIcon,
  DatabaseIcon,
  BackspaceIcon,
  DocumentReportIcon
} from '@heroicons/react/outline'
import { BsPerson } from 'react-icons/bs'
import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition, Disclosure } from '@headlessui/react'

import { NavLink } from 'react-router-dom'
import { Form, Link } from '@remix-run/react'
import type { ISessionModel } from '~/models/sessionModel'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({
  children,
  session
}: {
  children?: any
  session?: ISessionModel
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const dashboard = { name: 'Dashboard', icon: HomeIcon, href: '/' }

  const incomeMenu = {
    name: 'Incomes',
    icon: DatabaseIcon,
    href: 'incomes?size=10'
  }

  const expenseMenu = {
    name: 'Expenses',
    icon: BackspaceIcon,
    href: 'expenses?size=10'
  }

  const reportMenu = {
    name: 'Reports',
    icon: DocumentReportIcon,
    href: 'reports?size=10'
  }

  const myProfile = {
    name: 'My Profile',
    icon: UserIcon,
    href: 'account/my-profile'
  }

  const admin = { name: 'Admin', icon: UserGroupIcon, href: 'admin' }

  const NAVIGATIONS_LIST = [dashboard, incomeMenu, expenseMenu, reportMenu]

  if (session?.adminRole === 'superAdmin') {
    NAVIGATIONS_LIST.push(admin)
  }

  NAVIGATIONS_LIST.push(myProfile)

  const [navigationActive, setNavigationActive] = useState('Home')

  const renderListNavigation = NAVIGATIONS_LIST.map((item: any) => {
    return (
      <>
        {!item.children && (
          <div key={item.name} className="space-y-1 mx-1">
            <NavLink
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#f3f3f3' } : undefined
              }
              to={item.href}
              onClick={() => {
                setNavigationActive(item.name)
                setSidebarOpen(!sidebarOpen)
              }}
            >
              <div
                className={classNames(
                  navigationActive === item.name
                    ? 'text-teal-500'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-500',
                  'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-2xl'
                )}
              >
                <item.icon
                  className={classNames(
                    navigationActive === item.name
                      ? 'text-teal-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
            </NavLink>
          </div>
        )}

        {item.children && (
          <Disclosure
            as="div"
            key={item.name}
            className="space-y-1 mx-1"
            defaultOpen={item.current}
          >
            {({ open }) => {
              return (
                <>
                  <Disclosure.Button
                    className={classNames(
                      navigationActive === item.name
                        ? 'text-teal-500'
                        : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900',
                      'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        navigationActive === item.name
                          ? 'text-teal-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6 '
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    <svg
                      className={classNames(
                        open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                        'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150'
                      )}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                    </svg>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-1">
                    {item?.children?.map((subItem: any, index: number) => (
                      <NavLink
                        key={index}
                        to={subItem.href}
                        onClick={() => setNavigationActive(item.name)}
                      >
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className={`group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-2xl hover:text-gray-900 hover:bg-gray-200 ${
                            subItem.active ? 'text-gray-900  bg-gray-200' : ''
                          }`}
                        >
                          {subItem.name}
                        </a>
                      </NavLink>
                    ))}
                  </Disclosure.Panel>
                </>
              )
            }}
          </Disclosure>
        )}
      </>
    )
  })

  const renderMainSection = (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="relative bg-white shadow-sm z-10 flex-shrink-0 flex h-16">
        <div className="flex flex-row gap-5 items-center md:hidden ">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 "
            onClick={() => setSidebarOpen(true)}
          >
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <h1 className="text-md text-gray-700">
            <span className="font-extrabold text-xl text-teal-500">Terwallet</span>
          </h1>
        </div>
        <div className="flex-1 px-2 flex flex-row-reverse">
          <div className="ml-4 sm:mr-10 flex items-center">
            <Menu as="div" className="mx-3 relative">
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <BsPerson className="text-2xl mx-1 text-gray-500 cursor-pointer hover:bg-gray-200 rounded-full" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Form method="post" action="logout">
                    <button
                      type="submit"
                      className="block px-4 py-2 text-sm text-gray-700"
                    >
                      Logout
                    </button>
                  </Form>
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700"
                    to={'/account/my-profile'}
                  >
                    My profile
                  </Link>
                </Menu.Items>
              </Transition>
            </Menu>
            <label htmlFor="" className="hidden md:block text-gray-500 font-md">
              {session?.adminName}
            </label>
          </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-100">
        <div className="px-2 py-2 md:py-6 md:px-6 m-0">{children}</div>
      </main>
    </div>
  )

  const renderSideBarMobileMenu = (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex z-40 md:hidden"
        onClose={() => setSidebarOpen(!sidebarOpen)}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs mr-20 w-full pt-5 pb-4 bg-white">
            <div className="mt-5 flex-1 h-0 overflow-y-auto scrollbar-hide">
              <div className="flex flex-row justify-between mx-5">
                <h1 className="text-md text-gray-700">
                  <span className="font-extrabold text-xl text-teal-500">Terwallet</span>
                </h1>
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                </button>
              </div>
              <nav className="px-2 space-y-1">{renderListNavigation}</nav>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )

  const renderSideBarDesktopMenu = (
    <div className="h-screen flex overflow-hidden bg-white">
      <div className="hidden bg-white md:flex md:flex-shrink-0">
        <div
          className={`w-56 sm:block relative h-screen duration-100 border-r border-gray-200 px-3`}
        >
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <h1 className="text-md text-gray-700">
              <span className="font-extrabold text-xl text-teal-500">Terwallet</span>
            </h1>
            <div className="mt-5 flex-1 flex flex-col">
              {/* <h1 className="font-extrabold text-md text-md text-gray-500 my-3">
                Main Menu
              </h1> */}
              <nav className="flex-1 space-y-1">{renderListNavigation}</nav>
            </div>
          </div>
        </div>
      </div>
      {renderMainSection}
    </div>
  )

  return (
    <>
      {renderSideBarDesktopMenu}
      {renderSideBarMobileMenu}
    </>
  )
}
