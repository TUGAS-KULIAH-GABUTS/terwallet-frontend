import { Link } from '@remix-run/react'

type MessageType = {
  title?: string
  message: any
  link?: string
  linkTitle?: string
  type: 'success' | 'error' | 'info'
}

const generateColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'green'
    case 'error':
      return 'red'
    case 'info':
      return 'blue'
    default:
      return 'green'
  }
}

export const ShowMessage = (props: MessageType) => {
  return (
    <div className={`rounded-md shadow bg-${generateColor(props.type)}-50 p-4 w-full`}>
      <div className="flex">
        <div className="ml-3">
          {props.title && (
            <h3 className={`text-sm font-medium text-${generateColor(props.type)}-800`}>
              {props.title}
            </h3>
          )}
          <div className={`mt-2 text-sm text-${generateColor(props.type)}-700`}>
            <span className="text-md">{props.message} </span>
            {props.link && (
              <Link className="underline text-sm" to={props.link}>
                {props.linkTitle}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
