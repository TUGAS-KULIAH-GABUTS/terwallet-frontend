import {
  Form,
  useLoaderData,
  useSubmit,
  useTransition,
  useActionData
} from '@remix-run/react'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { API } from '~/services/api'
import { checkSession } from '~/services/session'
import { CONFIG } from '~/config'
import { Breadcrumb } from '~/components/breadcrumb'
import type { ISessionModel } from '~/models/sessionModel'
import { type IExpenseModel } from '~/models/expenseModel'

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: any = await checkSession(request)
  if (!session) return redirect('/login')
  return { isError: false, session }
}

export let action: ActionFunction = async ({ request }) => {
  const session: ISessionModel | any = await checkSession(request)
  if (!session) return redirect('/login')

  let formData = await request.formData()
  try {
    if (request.method == 'POST') {
      const payload: IExpenseModel | any = {
        expenseName: formData.get('expenseName'),
        expenseNominal: formData.get('expenseNominal')
      }

      await API.post(session, CONFIG.baseUrlApi + '/expenses', payload)

      return redirect('/expenses')
    }
    return { isError: false, request }
  } catch (error: any) {
    console.log(error)
    return { ...error, isError: true }
  }
}

export default function Index() {
  const navigation = [{ title: 'Create', href: '', active: true }]
  const loader = useLoaderData()
  const actionData = useActionData()
  const submit = useSubmit()
  const transition = useTransition()

  console.log(loader)
  if (loader.isError) {
    return (
      <h1 className="text-center font-bold text-3xl text-red-600">
        {loader.error?.messsage || 'error'}
      </h1>
    )
  }

  const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, {
      method: 'post',
      action: `/expenses/create`
    })
  }

  return (
    <div className="">
      <Breadcrumb title="expenses" navigation={navigation} />

      {actionData?.isError && (
        <div className="p-4 my-5 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error</span> {actionData.message}
        </div>
      )}

      <Form method={'post'} onSubmit={submitData} className="bg-white rounded-xl p-10">
        <div className="w-full md:mr-2">
          <div className="my-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Nama</label>
            <input
              name="expenseName"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              placeholder="nama..."
            />
          </div>
          <div className="my-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Nominal
            </label>
            <input
              name="expenseNominal"
              type="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              placeholder="nama..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="inline-flex justify-center w-32 rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
          >
            {transition?.submission ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </Form>
    </div>
  )
}
