/** @jsx jsx */
import {jsx} from '@emotion/core'

import './bootstrap'
import {useState, useEffect} from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
// 🐨 import the client from './utils/api-client'
import {client} from './utils/api-client'

function DiscoverBooksScreen() {
  // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  // const data = null // 💣 remove this, it's just here so the example doesn't explode
  // 🐨 you'll also notice that we don't want to run the search until the
  // user has submitted the form, so you'll need a boolean for that as well
  // 💰 I called it "queried"
  const [queried, setQueried] = useState(false)

  // 🐨 Add a useEffect callback here for making the request with the
  // client and updating the status and data.
  // 💰 Here's the endpoint you'll call: `books?query=${encodeURIComponent(query)}`
  // 🐨 remember, effect callbacks are called on the initial render too
  // so you'll want to check if the user has submitted the form yet and if
  // they haven't then return early (💰 this is what the queried state is for).
  useEffect(() => {
    if (!queried) return
    setStatus('loading')
    let data = {}
    async function fetchData() {
      data = await client(
        `${process.env.REACT_APP_API_URL}/books?query=${encodeURIComponent(
          query,
        )}`,
        {method: 'GET'},
      )
      console.log(data)
      setData(data)
      setStatus('success')
    }
    fetchData()
  }, [queried, query])

  // 🐨 replace these with derived state values based on the status.
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  function handleSearchSubmit(event) {
    // 🐨 call preventDefault on the event so you don't get a full page reload
    event.preventDefault()
    // 🐨 set the queried state to true
    setQueried(true)
    // 🐨 set the query value which you can get from event.target.elements
    setQuery(event.target.elements.search.value)
    // 💰 console.log(event.target.elements) if you're not sure.
    console.log(event.target.elements.search.value)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
