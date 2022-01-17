import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

const useListItems = user => {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
  })

  return listItems
}

// I did not implement this but it is a good idea because it
// reuses the existing useListItems hook
// function useListItem(user, bookId) {
//   const listItems = useListItems(user)
//   return listItems.find(li => li.bookId === bookId) ?? null
// }

const useUpdateListItem = user => {
  const [update] = useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token: user.token,
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )

  return update
}

const useRemoveListItem = user => {
  const [remove] = useMutation(
    ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )

  return remove
}

const useCreateListItem = user => {
  const [create] = useMutation(
    ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  return create
}

export {useListItems, useUpdateListItem, useRemoveListItem, useCreateListItem}
