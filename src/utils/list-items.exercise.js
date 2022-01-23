import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from './books'
import {client} from './api-client'

function useListItems(user) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
    config: {
      // Iterate over the list of items and set each book in the cache
      // which can be used later when you view an individual book
      onSuccess(listItems) {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return listItems ?? []
}

function useListItem(user, bookId) {
  const listItems = useListItems(user)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
  onError: (err, variables, recover) => {
    // recover is populated from the return value
    // of onMutate in the case a rollback is
    console.log('recover', recover)
    // return recover
    return typeof recover === 'function' ? recover() : recover ?? null
  },
}

function useUpdateListItem(user, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {
      ...defaultMutationOptions,
      onMutate: vars => {
        // vars is the same arguments that are pased to the useMutation fn
        console.log('onMutate', vars)

        // Preserve the original list-items from cache
        const oldListItems = queryCache.getQueryData('list-items')
        console.log('oldListItems', oldListItems)

        // Modify list-items optimistically
        const newListItems = oldListItems?.map(oldListItem => {
          if (oldListItem.id === vars.id) {
            return {...oldListItem, ...vars}
          }
          return oldListItem
        })
        console.log('newListItems', newListItems)
        // Override list-items with the optimistic newListItems
        queryCache.setQueryData('list-items', newListItems)
        /*
         The value returned from this function will be passed to both the onError and onSettled functions in the event of a mutation failure and can be useful for rolling back optimistic updates.
        
         Note: You can also return a function instead of a value like Kent did in
         the final solution
         return () => queryCache.setQueryData('list-items', oldListItems)
        */
        return oldListItems
      },
      ...options,
    },
  )
}

function useRemoveListItem(user, options) {
  return useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {
      ...defaultMutationOptions,
      onMutate: vars => {
        // vars is the same arguments that are pased to the useMutation fn
        console.log('onMutate', vars)

        // Preserve the original list-items from cache
        const oldListItems = queryCache.getQueryData('list-items')
        console.log('oldListItems', oldListItems)

        // Modify list-items optimistically
        const newListItems = oldListItems?.filter(
          oldListItem => oldListItem.id !== vars.id,
        )
        console.log('newListItems', newListItems)
        // Override list-items with the optimistic newListItems
        queryCache.setQueryData('list-items', newListItems)
        /*
         The value returned from this function will be passed to both the onError and onSettled functions in the event of a mutation failure and can be useful for rolling back optimistic updates.
        
         Note: You can also return a function instead of a value like Kent did in
         the final solution
         return () => queryCache.setQueryData('list-items', oldListItems)
        */
        return oldListItems
      },
      ...options,
    },
  )
}

function useCreateListItem(user, options) {
  return useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
