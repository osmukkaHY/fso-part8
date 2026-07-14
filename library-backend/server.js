const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")

const resolvers = require("./resolvers.js");
const typeDefs = require("./schema.js");

const startServer = (port) => {
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    startStandaloneServer(server, {
        listen: { port },
    }).then(({ url }) => {
        console.log(`Server ready at ${url}`)
    })
}

module.exports = startServer;
