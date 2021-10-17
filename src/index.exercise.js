// 🐨 you'll need to import React and ReactDOM up here
import React, {useState} from 'react'

import ReactDOM from 'react-dom'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
const App = () => {
  const [openModal, setOpenModal] = useState('none')

  return (
    <div>
      <div>Bookshelf</div>
      <Logo />
      <div>
        <>
          <Dialog isOpen={openModal === 'login'} aria-label={'login'}>
            <button
              className="close-button"
              onClick={() => setOpenModal('none')}
            >
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>×</span>
            </button>
            <p>Hello there. I am a login dialog</p>
          </Dialog>
        </>
        <>
          <Dialog isOpen={openModal === 'register'} aria-label={'register'}>
            <button
              className="close-button"
              onClick={() => setOpenModal('none')}
            >
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>×</span>
            </button>
            <p>Hello there. I am a register dialog</p>
          </Dialog>
        </>
        <button onClick={() => setOpenModal('login')}>Login</button>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
    </div>
  )
}
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
const root = document.getElementById('root')
ReactDOM.render(<App />, root)
