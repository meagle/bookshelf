import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ReactQueryDevtools} from 'react-query/devtools'

import {QueryClient, QueryClientProvider} from 'react-query'
import {AuthProvider} from './auth-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false
        else if (failureCount < 2) return true
        else return false
      },
    },
    mutations: {
      onError: (err, variables, recover) =>
        typeof recover === 'function' ? recover() : null,
    },
  },
})

function AppProviders({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
