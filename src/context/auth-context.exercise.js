import * as React from 'react'

const AuthContext = React.createContext()

const useAuth = () => {
  const authContext = React.useContext(AuthContext)
  if (!authContext) throw new Error('You must supply an AuthContext')
  return authContext
}

export {AuthContext, useAuth}
