const { gql } = require('apollo-server-express');

const typeDefs = gql`
    input SaveBookInput {
        authors: [String]
        description: String
        title: String
        bookId: String
        image: String
        link: String
    }

    type Book {
            bookId: String
            authors: [String]
            description: String
            title: String
            image: String
            link: String

    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }
    

    type Auth {
        token: ID!
        user: User
    }


    type Query {
        me: User
        users: [User]
        user(username:String!): User
        savedBooks(username: String): [Book]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: SaveBookInput): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;