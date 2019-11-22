var User = require('../models/user');
var jwt = require('jsonwebtoken');

typeDef = `
    type Mutation {
        signup (name: String!, email: String!, password: String!): String
    }
`

resolver = {
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
        }
    }
}

module.exports = { typeDef, resolver };