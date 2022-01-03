import {logout} from '../auth-provider'
const apiURL = process.env.REACT_APP_API_URL
function client(
  endpoint,
  {token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      console.log('401 repsonse encountered')
      await logout()
      window.location.assign(window.location)
      return Promise.reject({message: 'Please log back in and try again'})
    }

    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
