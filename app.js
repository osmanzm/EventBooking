const express = require ('express');
const bodyParser = require('body-parser');
const graohqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose =  require('mongoose');

const app = express();

const events = []; // temp storage for events

app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

app.use('/graphql', graohqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String! 
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String! 
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
        createEvent(eventInput: EventInput): Event
        }
        
        schema {
            query: RootQuery
             mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price:  +args.eventInput.price,
                date: args.eventInput.date
            };
            console.log(args);
            events.push(event);
            return event;

            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.en.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-cxkxc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=> {
        app.listen(3000);
    }).catch(()=> {
        console.log(err)
});

