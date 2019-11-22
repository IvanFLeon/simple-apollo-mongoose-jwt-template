const Query = require('./query.js');
const Mutation = require('./mutation.js');
const User = require('./user.js')

const { makeExecutableSchema } = require('graphql-tools');

module.exports = makeExecutableSchema({
    typeDefs: [Query.typeDef, Mutation.typeDef, User.typeDef],
    resolvers: [Query.resolver, Mutation.resolver, User.resolver]
});