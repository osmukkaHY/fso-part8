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
      let res = await Book.find({}).populate("author");
      if(!res) return undefined;
      if(author) {
        const authorObject = (await Author.findOne({name: author}));
        if(!authorObject) return null;
        const authorId = authorObject._id;
        res = res.filter(book => book.author.toString() === authorId.toString());
      }
      if(genre) res = res.filter(book => book.genres.includes(genre));
      return res;
    },
    allAuthors: async () => await Author.find({}),
    me: async (root, args, context) => {
      console.log(context)
      return {
        username: context.currentUser.username,
        favoriteGenre: context.currentUser.favoriteGenre
      }
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if(!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        });
      }
      if(await Book.exists({title: args.title})) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title
          }
        });
      }

      if(!await Author.exists({name: args.author})) {
        const newAuthor = Author({name: args.author})
        await newAuthor.save()
      }

      try {
        const authorObject = await Author.findOne({name: args.author});
        const newBook = new Book({...args, author: authorObject._id});
        const created = await newBook.save();
        return {...args, id: created.toString(), author: {name: authorObject.name, born: authorObject.born}};
      }
      catch (e) {
        throw new GraphQLError(`Couldn't save book: ${e}`)
      }
    },

    editAuthor: async (root, args, context) => {
      if(!context.currentUser) {
        console.log("unauthenticated");
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        });
      }
      let author = undefined;
      if(await Author.exists({name: args.name})) {
        author = await Author.findOne({name: args.name});
        author.born = args.setBornTo;
      }
      else {
        return null;
      }
      return author.save();
    },

    createUser: async (root, args) => {
    const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    console.log(user)

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
        favoriteGenre: user.favoriteGenre,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  }
}

module.exports = resolvers;