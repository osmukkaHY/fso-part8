const {GraphQLError} = require("graphql");
const {v1: uuid} = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js")
const Book = require("./models/book.js");
const Author = require("./models/author.js");

const resolvers = {
  Author: {
    bookCount: root => Book.collection.countDocuments()
  },
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, {author, genre}) => {
      let res = await Book.find({});
      if(author) {
        const authorId = (await Author.findOne({name: author}))._id;
        res = res.filter(book => book.author.toString() === authorId.toString());
      }
      if(genre) res = res.filter(book => book.genres.includes(genre));
      return res;
    },
    allAuthors: async () => await Author.find({}),
    me: async () => {
      // TODO
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if(!context.currentUser) {
        throw new GraphQLError("User must be logged in to add a book");
      }
      if(await Book.exists({title: args.title})) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title
          }
        });
      }

      const authorObject = await Author.findOne({name: args.author});
      if(!authorObject) {
        throw new GraphQLError(`Author not found: ${args.author}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author
          }
        });
      }

      try {
        const newBook = new Book({...args, author: authorObject._id});
        return newBook.save();
      }
      catch (e) {
        throw new GraphQLError(`Couldn't save book: ${e}`)
      }
    },

    editAuthor: async (root, args, context) => {
      if(!context.currentUser) {
        throw new GraphQLError("User must be logged in to edit an author");
      }
      let author = undefined;
      if(await Author.exists({name: args.name})) {
        author = await Author.findOne({name: args.name});
        author.born = args.setBornTo;
      }
      else {
        try {
          author = new Author({name: args.name, born: args.setBornTo});
        }
        catch (e) {
          throw new GraphQLError(`Couldn't update author: ${e}`);
        }
      }
      return author.save();
    },

    createUser: async (root, args) => {
    const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

    return user.save()
      .catch(e => {
        throw new GraphQLError(`Creating the user failed: ${e.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
          }
        })
      })
    },

    login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

module.exports = resolvers;