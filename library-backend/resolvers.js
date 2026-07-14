const {GraphQLError} = require("graphql");
const {v1: uuid} = require("uuid");
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
  },

  Mutation: {
    addBook: async (root, args) => {
      console.log(args.title);
      if(await Book.exists({title: args.title})) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title
          }
        });
      }

      const authorObject = await Author.findOne({name: args.author});
      const newBook = new Book({...args, author: authorObject._id});
      return newBook.save();
    },

    editAuthor: async (root, args) => {
      let author = undefined;
      if(await Author.exists({name: args.name})) {
        author = await Author.findOne({name: args.name});
        author.born = args.setBornTo;
      }
      else {
        author = new Author({name: args.name, born: args.setBornTo});
      }
      return author.save();
    }
  }
}

module.exports = resolvers;