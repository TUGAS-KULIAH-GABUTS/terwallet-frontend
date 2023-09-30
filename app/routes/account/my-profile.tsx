import { useLoaderData, useActionData, Link } from '@remix-run/react'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/router'
import { API } from '~/services/api'
import { checkSession } from '~/services/session'
import { CONFIG } from '~/config'
import { Breadcrumb } from '~/components/breadcrumb'
import type { IAdminCreateRequestModel, IAdminModel } from '~/models/adminModel'
import type { ISessionModel } from '~/models/sessionModel'

export let loader: LoaderFunction = async ({ params, request }) => {
  const session: ISessionModel | any = await checkSession(request)
  if (!session) return redirect('/login')
  try {
    const result = await API.get(session, CONFIG.baseUrlApi + `/my-profile`)
    return {
      admin: result,
      session: session,
      isError: false
    }
  } catch (error: any) {
    console.log(error)
    return { ...error, isError: true }
  }
}

export let action: ActionFunction = async ({ request }) => {
  const session: ISessionModel | any = await checkSession(request)
  if (!session) return redirect('/login')

  let formData = await request.formData()
  try {
    if (request.method == 'PATCH') {
      const payload: IAdminCreateRequestModel | any = {
        adminId: formData.get('adminId'),
        adminName: formData.get('adminName'),
        adminEmail: formData.get('adminEmail'),
        adminPassword: formData.get('adminPassword'),
        adminRole: formData.get('adminRole')
      }

      await API.patch(session, CONFIG.baseUrlApi + '/my-profile', payload)

      return redirect('/admin')
    }
    return { isError: false, request }
  } catch (error: any) {
    console.log(error)
    return { ...error, isError: true }
  }
}

export default function Index() {
  const navigation = [{ title: 'Profile', href: '', active: true }]
  const loader = useLoaderData()
  console.log(loader)

  const actionData = useActionData()
  const admin: IAdminModel = loader?.admin

  if (loader.isError) {
    return (
      <h1 className="text-center font-bold text-3xl text-red-600">
        {loader.error?.messsage || `error ${loader.code || ''}`}
      </h1>
    )
  }

  return (
    <div className="">
      <Breadcrumb title="My Profile" navigation={navigation} />

      {actionData?.isError && (
        <div className="p-4 my-5 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error</span> {actionData.message}
        </div>
      )}

      <div className="ml-0 md:ml-4 mt-4 md:mt-0 bg-white rounded-xl p-5 sm:p-10">
        <div className="flex gap-5 items-center my-5">
          <h3 className="text-lg font-semibold">Nama : </h3>
          <p className="text-gray-800">{admin.adminName}</p>
        </div>
        <div className="flex gap-5 items-center my-5">
          <h3 className="text-lg font-semibold">Email : </h3>
          <p className="text-gray-800">{admin.adminEmail}</p>
        </div>
        <div className="flex gap-5 items-center my-5">
          <h3 className="text-lg font-semibold">Role : </h3>
          <p className="text-gray-800">{admin.adminRole}</p>
        </div>
        <div className="flex justify-end mt-4">
          <Link to={'/account/edit-my-profile'}>
            <button
              type="submit"
              className="inline-flex justify-center w-32 rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
            >
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
