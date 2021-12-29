function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      console.log(response)
      return Promise.reject(response)
    })
}

export {client}
