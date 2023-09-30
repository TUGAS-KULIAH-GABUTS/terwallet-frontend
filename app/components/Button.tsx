import type { ButtonHTMLAttributes } from 'react'
import mergeStyles from '~/utilities/mergeStyles'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  mode?: 'primary' | 'secondary' | 'danger'
}

const defaultStyles =
  'ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2'

const modeStyles = {
  primary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  secondary: 'bg-white hover:bg-gray-200 focus:ring-green-500 text-green-600',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
}

export default function Button(props: Props) {
  const { mode = 'primary' } = props

  return (
    <button {...props} className={mergeStyles(defaultStyles, modeStyles[mode])}>
      {props.label}
    </button>
  )
}
