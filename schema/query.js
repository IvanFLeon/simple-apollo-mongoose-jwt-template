var User = require('../models/user');
var jwt = require('jsonwebtoken');

typeDef = `
    type Query {
        me: User
        login (email: String!, password: String!): String
    }
`

resolver = {
    Query: {
        me: async (_, args, context) => {
            var {user_id} = context;

            // Verify if user is logged in
            if(!user_id) throw new Error("You're not authenticated");
            return await User.findById(user_id);
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
}

module.exports = { typeDef, resolver };