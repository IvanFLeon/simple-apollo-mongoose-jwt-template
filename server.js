require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var schema = require('./schema/schema');

mongoose.connect(process.env.MONGODB_URI + process.env.DATABASE, {useNewUrlParser: true});

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

const server = new ApolloServer({schema, context});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});