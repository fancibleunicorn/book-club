const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('Book');
        },
        // get a single user
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('Book');
        },
        me: async (parent, args, context) => {
            if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('Book');
        
            return userData;
            }
        
            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
    
            return { token,user };
          },

          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
    
            const correctPw = await user.isCorrectPassword(password);
    
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
    
            const token = signToken(user);
            return { token, user };
            },

            saveBook: async (parent, { input }, context) => {
                if (context.user) {

                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $push: { savedBooks: input } },
                        { new: true, runValidators: true }
                    )
                    ;

                    return updatedUser;
                }
                throw new AuthenticationError('You need to be logged in!');
                
            },
            removeBook: async (parent, { bookId }, context) => {
                if (context.user) {

                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: {bookId: bookId }} },
                        { new: true, runValidators: true }
                    )
                    ;

                    return updatedUser;
                }
                throw new AuthenticationError('You need to be logged in!');
                
            }
    }
      
};

module.exports = resolvers;