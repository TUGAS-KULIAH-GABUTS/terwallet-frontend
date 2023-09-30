import { Link } from '@remix-run/react'

const Breadcrumb = ({ title, navigation }: { title: String; navigation: any[] }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <label className="text-xl font-semibold text-gray-900">{title}</label>
      </div>
      <nav className="flex text-gray-700 rounded-lg" aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
          {navigation?.map((value: any, index: number) => (
            <li key={'navigation-' + index}>
              <div className="flex items-center">
                {index != 0 ? (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  ''
                )}
                {!value.active ? (
                  <Link to={value.href}>
                    <span
                      className={`${
                        index != 0 ? 'ml-1 md:ml-2' : ''
                      } text-sm font-medium text-teal-600`}
                    >
                      {value.title}
                    </span>
                  </Link>
                ) : (
                  <span
                    className={`${
                      index != 0 ? 'ml-1 md:ml-2' : ''
                    } text-sm font-medium text-gray-400`}
                  >
                    {value.title}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

export { Breadcrumb }
