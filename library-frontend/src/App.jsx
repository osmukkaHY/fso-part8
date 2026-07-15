import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from "./components/Recommended"
import Login from "./components/Login.jsx"
import {useApolloClient} from "@apollo/client/react"


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem("library-user-token"));
  const [message, setMessage] = useState(null);
  const client = useApolloClient();

  const logout = async () => {
    setPage("login");
    setToken(null);
    localStorage.clear();
    await client.clearStore();
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && (<button onClick={() => setPage("login")}>log in</button>)}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommended')}>recommended</button>}
        {token && <button onClick={() => logout()}>logout</button>}
      </div>
      <p>{message}</p>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommended show={page === "recommended"} userToken={token} />

      <NewBook show={page === 'add'} />

      <Login show={page === "login"} setToken={setToken} setPage={setPage} setMessage={setMessage} />
    </div>
  )
}

export default App
