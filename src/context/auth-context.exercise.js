/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {useQueryClient} from 'react-query'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
    status,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const queryClient = useQueryClient()

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = React.useCallback(() => {
    auth.logout()
    queryClient.clear()
    setData(null)
  }, [queryClient, setData])

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const value = {user, login, register, logout}
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const {user} = useAuth()
  const token = user.token

  // this is more efficient with destructuring
  // const {
  //   user: {token},
  // } = useAuth()

  return React.useCallback(
    function authenticatedClient(endpoint, config) {
      return client(endpoint, {...config, token})
    },
    [token],
  )
}

export {AuthProvider, useAuth, useClient}