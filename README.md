## Introduction

This is a **NestJS** application that illustrates the use of **CQRS** in combination with **Event Sourcing**. For this project
I have chosen to use an in-memory **EventStore**, by building my own simple EventStore. This means that the events are
not persisted to a database. This is done to keep the project simple and to focus on the CQRS and Event Sourcing part of
the application.

I've written tests for the **CommandHandlers**, **EventHandlers** and **QueryHandlers**. Most interesting parts of the code
live in the `products` module. The `products` module is a simple CRUD module that uses CQRS and Event Sourcing.

The in-memory EventStore is implemented is located top-level in the `src/event-store.service.ts` file. The EventStore
follows the principle of only updating the state of the application by using events. The events are stored in the
`store` Map. Each object gets a unique key, all updates to the object are stored at the same key in the form of a list - 
a new update to the object is simply merged with the latest version of the object and appended to the list of events.
Each event has a name to specify which event caused the update, it also has a type to differentiate between
types of objects stored in the EventStore.

So, when saving a new event to the EventStore, the EventStore will insert the event into the `store` Map given the 
unique key. The key is a random generated ID, preferably a UUID to prevent clashes but for this testing application I've
chosen for a smaller concise more readable ID.

When retrieving a single object from the EventStore, the EventStore will retrieve the latest event for the given key
and return that state. This is a simplified version of a real EventStore, but it illustrates the concept of Event Sourcing.
For the real version you would need to retrieve all events for the given key and apply them to the object to get the
latest state - however, to keep things a bit easier I've chosen to only retrieve the latest event which holds the 
last version.

Ideally, you would want to persist the events to a database and therefore use a existing technologies that implement
the illustrated behaviour as explained above (i.e, gather all events and apply them on top of each other to get the latest
state of the object). **But then I would have as much fun as I did now!**

See below for install instructions, how to test the application and how to use the GraphQL playground 
(or CURL, or import CURL in to Postman) to test the application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Curl Commands and GraphQL Requests
To test the application you can use the following graphql request bodies, followed by the curl commands with that same data.
You can also run the application and go to `http://localhost:3000/graphql` to use the GraphQL playground.

### GraphQL schema
Fetch the GraphQL schema by running the following command:

```bash
curl 'http://localhost:3000/graphql' \
  -H 'Accept-Language: en' \
  -H 'Apollo-Query-Plan-Experimental: 1' \
  -H 'Connection: keep-alive' \
  -H 'Origin: http://localhost:3000' \
  -H 'Referer: http://localhost:3000/graphql' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' \
  -H 'X-Apollo-Tracing: 1' \
  -H 'accept: */*' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  --data-raw '{"operationName":"IntrospectionQuery","variables":{},"query":"query IntrospectionQuery {\n  __schema {\n    queryType {\n      name\n    }\n    mutationType {\n      name\n    }\n    subscriptionType {\n      name\n    }\n    types {\n      ...FullType\n    }\n    directives {\n      name\n      description\n      locations\n      args {\n        ...InputValue\n      }\n    }\n  }\n}\n\nfragment FullType on __Type {\n  kind\n  name\n  description\n  fields(includeDeprecated: true) {\n    name\n    description\n    args {\n      ...InputValue\n    }\n    type {\n      ...TypeRef\n    }\n    isDeprecated\n    deprecationReason\n  }\n  inputFields {\n    ...InputValue\n  }\n  interfaces {\n    ...TypeRef\n  }\n  enumValues(includeDeprecated: true) {\n    name\n    description\n    isDeprecated\n    deprecationReason\n  }\n  possibleTypes {\n    ...TypeRef\n  }\n}\n\nfragment InputValue on __InputValue {\n  name\n  description\n  type {\n    ...TypeRef\n  }\n  defaultValue\n}\n\nfragment TypeRef on __Type {\n  kind\n  name\n  ofType {\n    kind\n    name\n    ofType {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"}' \
  --compressed
```

### Create a product

```graphql
mutation {
    createProduct(createProductInput: {
        name: "Blue-T-Shirt",
        description: "What a beauty",
        sku: "t-shirt-blue",
        price: 29.95,
    }) {
        id
        name
        description
        sku
        price
    }
}
```

```bash
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"# Write your query or mutation here\nmutation {\n  createProduct(createProductInput: {\n    name: \"Blue-T-Shirt\",\n    description: \"What a beauty\",\n    sku: \"t-shirt-blue\",\n    price: 29.95,\n  }) {\n    id\n    name\n    description\n    sku\n    price\n  }\n}"}' --compressed
```


### Get a product

> Note: Change the ID to the ID of the product you created in the previous step.

```graphql
query {
 product(id: "3a47chm6fjqu855y") {
    id
    name
    description
    sku
    price
  }
}
```

```bash
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"{\n  product(id: \"0mhdegrerx410u65\") {\n    id\n    name\n    description\n    price\n    sku\n  }\n}"}' --compressed
```

### Update a product

> Note: Change the ID to the ID of the product you created in the first step.

```graphql
mutation {
  updateProduct(updateProductInput: {
    id: "3a47chm6fjqu855y"
    name: "Green-T-Shirt",
    description: "What a beauty",
    sku: "t-shirt-blue",
    price: 29.95,
  }) {
    id
    name
    description
    sku
    price
  }
}
```

```bash
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"mutation {\n  updateProduct(updateProductInput: {\n    id: \"3a47chm6fjqu855y\"\n    name: \"Green-T-Shirt\",\n    description: \"What a beauty\",\n    sku: \"t-shirt-blue\",\n    price: 29.95,\n  }) {\n    id\n    name\n    description\n    sku\n    price\n  }\n}"}' --compressed
```

> Note: Change the ID to the ID of the product you created in the first step.

### Delete a product

```graphql
mutation {
  removeProduct(id: "7n0atkzf9rekfx8h") {
    id
    name
    description
    sku
    price
  }
}
```

```bash
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"mutation {\n  removeProduct(id: \"7n0atkzf9rekfx8h\") {\n    id\n    name\n    description\n    sku\n    price\n  }\n}"}' --compressed
```


### List all products

```graphql
{
  products {
    id
    name
    description
    sku
    price
  }
}
```

```bash
curl 'http://localhost:3000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:3000' --data-binary '{"query":"query {\n products {\n    id\n    name\n    description\n    sku\n    price\n  }\n}"}' --compressed
```