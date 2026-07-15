import {useState} from "react"
import {useMutation, useQuery} from "@apollo/client/react"
import queries from "../queries.js"

const Authors = (props) => {
  const [authorName, setAuthorName] = useState("");
  const [authorBirthYear, setAuthorBirthYear] = useState("");
  const [editAuthor] = useMutation(queries.EDIT_AUTHOR, {refetchQueries: [{query: queries.ALL_AUTHORS}]});
  const result = useQuery(queries.ALL_AUTHORS);
  if (!props.show) {
    return null;
  }

  if(result.loading)
    return <div>loading...</div>

  const authors = result.data.allAuthors;

  const addBirthYear = e => {
    e.preventDefault();
    if(!authorName) return

    editAuthor({
      variables: {
        name: authorName,
        year: parseInt(authorBirthYear)
      }
    });

    setAuthorName("");
    setAuthorBirthYear("");
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {localStorage.getItem("library-user-token") && (
      <div>
      <h3>Set birthyear</h3>
      <form onSubmit={addBirthYear}>
        <div>
          <label>
            name
            <select
              name="name"
              onChange={({target}) => setAuthorName(target.value)}
            >
              <option disabled selected value>- Select a name -</option>
              {authors.map(a => (
                <option value={a.name}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            birth year
            <input
              type="text"
              value={authorBirthYear}
              onChange={({target}) => setAuthorBirthYear(target.value)}
            />
          </label>
        </div>
        <button type="submit">submit</button>
      </form>
      </div>)}
    </div>
  )
}

export default Authors
