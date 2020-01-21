
const express = require ('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose =  require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/events.js');
const User = require('./models/user.js');

const app = express();


app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String! 
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        } 
        
        input EventInput {
            title: String!
            description: String! 
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery
             mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return {...event._doc };
                });
            }).catch(err => {
                throw err
            });
        },
        createEvent: (args) => {

            const event = new Event({
                    title: args.eventInput.title,
                description: args.eventInput.description,
                price:  +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc};
                })
                .catch(err => {
                    console.log(err)
                    throw err;
                });
            return event;

            const eventName = args.name;
            return eventName;
        },
        createUser: args => {
            return bcrypt.hash(args.userInput.password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: args.userInput.password
                    });
                    return user.save();
                })
                .then(result => {
                    return {...result._doc, _id: result .id };
                })
                .catch(err => {
                throw err;
            })

        }
    },
    graphiql: true
}));

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useUnifiedTopology", true);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-cxkxc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
        // reconnectTries: 100,
        // reconnectInterval: 500,
        // autoReconnect: true,
        useNewUrlParser: true,
        useUnifiedTopology: false
    })
    //.catch(err => console.log('Mongo connection error', err))

    .then(()=> {
        app.listen(3000);
        console.log("listening on port 3030")
    }).catch((err)=> {
        console.log(err)
    }
);

