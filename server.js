var express = require('express');
var graphqlHTTP = require('express-graphql');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('moma.db');
var { buildSchema } = require('graphql');
var { GraphQLScalarType } = require('graphql');

const resolverMap = {
    Date: new GraphQLScalarType({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value);
      },
      serialize(value) {
        return value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value)
        }
        return null;
      },
    }),
};

var schema = buildSchema(`
    scalar Date

    type Artist {
        ConstituentID: Int
        DisplayName: String
        ArtistBio: String
        Nationality: String
        Gender: String
        BeginDate: Date
        EndDate: Date
    }

    type Artwork {
        Title: String
        ConstituentID: Int
        Classification: String
        Department: String
        DateAcquired: Date
        URL: String
        ThumbnailURL: String
    }

    type Query {
        artists: [Artist]
        artworks: [Artwork]
        artworkByArtist(ConstituentID: Int): [Artwork]
    }
`);

var getArtists = function() {
    return new Promise((resolve, reject) => {
        db.all("SELECT *  FROM Artists LIMIT 50", function(err, rows) {
            resolve(rows);
        });
    });
}

var getArtworks = function() {
    return new Promise((resolve, reject) => {
        db.all("SELECT *  FROM Artworks LIMIT 50", function(err, rows) {
            resolve(rows);
        });
    });
}

var getArtworkByArtist = function(args) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT *  FROM Artworks WHERE ConstituentID = "${args.ConstituentID.toString()}"`, function(err, rows) {
            resolve(rows);
        });
    });
}
var root = {
    artists: getArtists,
    artworks: getArtworks,
    artworkByArtist: getArtworkByArtist
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql')