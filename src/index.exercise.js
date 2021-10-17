// 🐨 you'll need to import React and ReactDOM up here
import * as React from 'react'
import ReactDOM from 'react-dom'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'

const loginClicked = () => alert('Login button clicked')

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
const App = () => (
  <div>
    <div>Bookshelf</div>
    <Logo />
    <div>
      <button onClick={loginClicked}>Login</button>
      <button>Register</button>
    </div>
  </div>
)
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// 🐨 use ReactDOM to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
const root = document.getElementById('root')
ReactDOM.render(<App />, root)
