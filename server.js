require('dotenv').config();
var { ApolloServer, gql } = require('apollo-server');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var schema = require('./schema/schema');

//Connect to MonogDB
mongoose.connect(process.env.MONGODB_URI + process.env.DATABASE, {useNewUrlParser: true});

//Authenticate user
var context = ({req}) => {
  const tokenWithBearer = req.headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];
  var user_id = null;
  try {
    if (token) {
      user_id = jwt.verify(token, process.env.PRIVATE_KEY);
    }
  } catch (err) {
    throw err;
  }
  return {user_id};
}

//Create and start ApolloServer
const server = new ApolloServer({schema, context});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});