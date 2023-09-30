import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { logout } from '~/services/session'

export let action: ActionFunction = async ({ request }) => {
  return logout(request)
}

export let loader: LoaderFunction = async () => {
  return redirect('/')
}

export default function Logout() {
  return <div />
}
