const fs = require('fs');
require('dotenv').config();
const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {MongoClient} = require('mongodb');

const DBNAME = process.env.DBNAME
const url = process.env.DB_URL;

let db;

const productList = async () => db.collection(DBNAME).find({}).toArray();

const performAdd = async (_, {product}, id) => {
    const productInsert = {...product};
    productInsert.id = id;
    const result = await db.collection(DBNAME).insertOne(productInsert);
    return db
        .collection(DBNAME)
        .findOne({_id: result.insertedId});
};

const addProduct = (_, {product}) => {
    return productList().then((result) => {
        performAdd(_, {product}, result[result.length - 1].id + 1).then( r => r)
    })
}

const connectToDb = async () => {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db();
};

const resolvers = {
    Query: {
        productList,
    },
    Mutation: {
        addProduct,
    },
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
});

const app = express();
app.use(express.static('public'));


server.start().then(async res => {
    server.applyMiddleware({app, path: '/graphql'});
    await connectToDb();
    app.listen({port: 3000}, () => {
            console.log('Assignment 4 React is running at http://localhost:8000')
            console.log('Assignment 4 GraphQL is running at http://localhost:3000' + server.graphqlPath)
        }
    )
})