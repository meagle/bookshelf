import {useQuery, useMutation, useQueryClient} from 'react-query'
import {useClient} from 'context/auth-context'
import {setQueryDataForBook} from './books'

function useListItems(options = {}) {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      authenticatedClient(`list-items`).then(data => data.listItems),
    ...options,
    onSuccess: async listItems => {
      await options.onSuccess?.(listItems)
      for (const listItem of listItems) {
        setQueryDataForBook(queryClient, listItem.book)
      }
    },
  })
  return data ?? []
}

function useListItem(bookId) {
  const listItems = useListItems()
  return listItems.find(li => li.bookId === bookId) ?? null
}

function useUpdateListItem(options) {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    updates =>
      authenticatedClient(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryClient.getQueryData('list-items')

        queryClient.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryClient.setQueryData('list-items', previousItems)
      },
      onSettled: () => queryClient.invalidateQueries('list-items'),
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    ({id}) => authenticatedClient(`list-items/${id}`, {method: 'DELETE'}),
    {
      onMutate(removedItem) {
        const previousItems = queryClient.getQueryData('list-items')

        queryClient.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id)
        })

        return () => queryClient.setQueryData('list-items', previousItems)
      },
      onSettled: () => queryClient.invalidateQueries('list-items'),
      ...options,
    },
  )
}

function useCreateListItem(options) {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    ({bookId}) => authenticatedClient(`list-items`, {data: {bookId}}),
    {onSettled: () => queryClient.invalidateQueries('list-items'), ...options},
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
