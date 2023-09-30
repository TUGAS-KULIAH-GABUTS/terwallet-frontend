import { createCookieSessionStorage, redirect } from 'remix'
import { CONFIG } from '~/config'
import type { ISessionModel } from '~/models/sessionModel'
import { CONSOLE } from '~/utilities/log'

export let storage = createCookieSessionStorage({
  cookie: {
    name: CONFIG.session.name,
    secure: CONFIG.env == 'production',
    secrets: [CONFIG.session.secret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
    httpOnly: true
  }
})

export async function createSession(data: ISessionModel) {
  try {
    let session = await storage.getSession()
    session.set('adminId', data.adminId)
    session.set('adminName', data.adminName)
    session.set('adminEmail', data.adminEmail)
    session.set('adminRole', data.adminRole)
    session.set('session', data.session)
    session.set('sessionExpiredOn', data.sessionExpiredOn)

    return redirect('/', {
      headers: { 'Set-Cookie': await storage.commitSession(session) }
    })
  } catch (error) {
    CONSOLE.log(error)
  }
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get('Cookie'))
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}

export const checkSession = async (request: Request) => {
  const session = await storage.getSession(request.headers.get('Cookie'))
  const isLogedIn = session.has('adminId')
  if (!isLogedIn) return false

  const result: ISessionModel = {
    adminId: session.get('adminId'),
    adminName: session.get('adminName'),
    adminEmail: session.get('adminEmail'),
    adminRole: session.get('adminRole'),
    session: session.get('session'),
    sessionExpiredOn: session.get('sessionExpiredOn')
  }

  return result
}
