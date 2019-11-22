const { ApolloServer, gql } = require('apollo-server');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI + process.env.DATABASE, {useNewUrlParser: true});

// Construct a schema, using GraphQL schema language
var typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    me: User
  }
  type Mutation {
    signup (name: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
  }
`;

// Define resolvers for the schema
const resolvers  = {
  Query: {
    me: async (_, args, context) => {
      var {user_id} = context;
  
      // Verify if user is logged in
      if(!user_id) throw new Error("You're not authenticated");
      return await User.findById(user_id);
    }
  },
  Mutation: {
    signup: async (_, args, context) => {
      var {name, email, password} = args;
  
      const user = await User.create({
        name,
        email,
        password
      });
  
      //TODO: Catch error dealing with not unique "email" field
  
      return jwt.sign(user._id.toString(), process.env.PRIVATE_KEY);
    },
    login: async (_, args, context) => {
      var {email, password} = args;
  
      const user = await User.findOne({email})
  
      if (!user) throw new Error("No user registered with this email");
  
      var isMatch = await user.comparePassword(password);
  
      if (!isMatch) throw new Error("Invalid password");
  
      return jwt.sign(user._id.toString(), process.env.PRIVATE_KEY);
    }
  }
};

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

const server = new ApolloServer({typeDefs, resolvers, context});
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});