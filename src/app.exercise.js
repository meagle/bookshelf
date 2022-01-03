/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {client} from './utils/api-client'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
  const [user, setUser] = React.useState(null)

  const getUser = async () => {
    let user = null
    const token = await auth.getToken()
    if (token) {
      console.log('token', token)
      // we're logged in! Let's go get the user's data:
      // await client('me', {token}).then(data => {
      //   console.log(data.user)
      //   user = data.user
      // })
      user = await client('me', {token})
    }
    return user
  }

  React.useEffect(() => {
    getUser().then(data => {
      console.log('data:', data)
      setUser(data.user)
    })
  }, [])

  const login = form =>
    auth.login(form).then(u => {
      setUser(u)
      // return this value so it can be retrived by the aync hook and set in 'data'
      return u
    })
  const register = form => auth.register(form).then(u => setUser(u))
  const logout = () => {
    auth.logout()
    setUser(null)
  }

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}
