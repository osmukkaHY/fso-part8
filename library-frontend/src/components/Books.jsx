import {useState} from "react"
import {useQuery} from "@apollo/client/react"
import queries from "../queries.js"

const Books = (props) => {
  const res = useQuery(queries.ALL_BOOKS);
  const [filter_, setFilter] = useState(null);
  const visible_res = useQuery(queries.BOOKS_BY_GENRE, {variables: {genre: filter_}});
  if (!props.show) {
    return null
  }
  if(res.loading || visible_res.loading)
    return <div>loading...</div>


  const handleFilterChange = async (newFilter) => {
    await setFilter(newFilter);
  }


  const books = res.data.allBooks.map(bookObject => ({
    title: bookObject.title,
    published: bookObject.published,
    author: bookObject.author.name,
    genres: bookObject.genres,
    id: bookObject.id
  }));

  const visible_books = visible_res.data.allBooks.map(bookObject => ({
    title: bookObject.title,
    published: bookObject.published,
    author: bookObject.author.name,
    genres: bookObject.genres,
    id: bookObject.id
  }));
  const genres = books
    .map(book => book.genres)
    .reduce((allInstances, current) => allInstances.concat(current), [])  // Concatenate all genres in one array.
    .reduce((filtered, current) => filtered.includes(current) ? filtered : filtered.concat(current), []); // Remove duplicates.

  return (
    <div>
      <h2>books</h2>
      <p>in {filter_ === null
              ? (<><em>all</em> genres</>)
              : (<>genre <em>{filter_}</em></>)}</p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {visible_books
            .map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    {genres.map((g) => (
      <button onClick={() => handleFilterChange(g)}>{g}</button>
    ))}
    <button onClick={() => handleFilterChange(null)}>all genres</button>
    </div>
  )
}

export default Books
