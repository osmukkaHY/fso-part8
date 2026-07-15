import {useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react"
import {useApolloClient} from "@apollo/client/react"
import queries from "../queries.js"

const LoginForm = ({show, setToken, setPage, setMessage}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const res = useQuery(queries.USER_FAVORITE_GENRE);
  const client = useApolloClient();

  const [login] = useMutation(queries.LOGIN, {
    onCompleted: async (data) => {
      console.log(data)
      if(data.errors) {
        setMessage("login failed");
        setTimeout(() => setMessage(null), 5000);
      return;
      }
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      await client.refetchQueries({
        include: [queries.USER_FAVORITE_GENRE]
      })
      console.log("User data", res.data)
      localStorage.setItem("user-favorite-genre", res.data.me.favoriteGenre)
      setPage("authors");
    },
    onError: e => {
    }
  })

  if(!show)
    return null;

  const submit = e => {
    e.preventDefault();
    login({variables: {username, password}});
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          </label>
        </div>
        <div>
          <label>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
