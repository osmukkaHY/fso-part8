import {gql} from "@apollo/client"

const CREATE_BOOK = gql`
  mutation addBookDynamic(
    $title: String!,
    $author: String!,
    $published: Int!
    $genres: [String!]!
    ) {
      addBook(
        title: $title
        author: $author
        published: $published
        genres: $genres
      ) {
        title
        author
        published
        genres
      }
  }
`

const ALL_BOOKS = gql`
  query {
    allBooks {
      title,
      published,
      author {
        name
        born
      },
      id,
      genres
    }
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name,
      born,
      id,
      bookCount
    }
  }
`
const EDIT_AUTHOR = gql`
  mutation changeBirthyear(
    $name: String!
    $year: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $year
    ) {
      name
      born
    }
  }
`

const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

export default {
    CREATE_BOOK,
    ALL_BOOKS,
    ALL_AUTHORS,
    EDIT_AUTHOR,
    LOGIN
}
