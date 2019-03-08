var express = require('express');
var graphqlHTTP = require('express-graphql');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('moma.db');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Artist {
        ConstituentID: String,
        DisplayName: String,
        ArtistBio: String,
        Nationality: String,
        Gender: String,
        BeginDate: String,
        EndDate: String,
        WikiQID: String,
        ULAN: String
    }

    type Query {
        artists: [Artist]
    }
`);

var getArtists = function() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM Artists LIMIT 5", function(err, rows) {
            resolve(rows);
        });
    })
}

var root = {
    artists: getArtists
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql')