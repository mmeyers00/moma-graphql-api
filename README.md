# moma-graphql-api

* Run `node server.js`
* Proceed to [http://localhost:4000](http://localhost:4000)

* List first 50 Artists:
```
{
  artists
}
```

* List first 50 Artworks:
```
{
  artworks
}
```

* List artworks done by specific artist
```
{
  artworkByArtist (ConstituentID: 6210) 
}
```