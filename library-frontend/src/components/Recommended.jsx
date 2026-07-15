import {useQuery} from "@apollo/client/react"
import queries from "../queries.js"

const Recommended = ({show}) => {
  const genre = localStorage.getItem("user-favorite-genre");
  const res = useQuery(queries.BOOKS_BY_GENRE, {variables: {genre: genre}});

  if(!show)
    return null;
  if(res.loading)
    return (<p>loading</p>)

  const books = res.data ? res.data.allBooks.map(bookObject => ({
    title: bookObject.title,
    published: bookObject.published,
    author: bookObject.author.name,
    genres: bookObject.genres,
    id: bookObject.id
  })) : null;
  console.log("Books", books)
  return (
    <div>
      <h2>recommendations</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended;