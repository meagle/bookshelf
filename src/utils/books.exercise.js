import * as React from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {useClient} from 'context/auth-context'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (queryClient, query, client) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`).then(data => data.books),
  onSuccess(books) {
    for (const book of books) {
      setQueryDataForBook(queryClient, book)
    }
  },
})

function useBookSearch(query) {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  const result = useQuery(
    getBookSearchConfig(queryClient, query, authenticatedClient),
  )
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const authenticatedClient = useClient()

  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      authenticatedClient(`books/${bookId}`).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const authenticatedClient = useClient()
  const queryClient = useQueryClient()

  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryClient.removeQueries('bookSearch')
      await queryClient.prefetchQuery(
        getBookSearchConfig(queryClient, '', authenticatedClient),
      )
    },
    [authenticatedClient, queryClient],
  )
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(queryClient, book) {
  queryClient.setQueryData(['book', {bookId: book.id}], book, bookQueryConfig)
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook}
