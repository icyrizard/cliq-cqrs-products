## Introduction

This is a nestJS application illustration the use of CQRS in combination with Event Sourcing. For this project
I have chosen to use an in-memory EventStore. Meaning that the events are not persisted to a database. This is
done to keep the project simple and to focus on the CQRS and Event Sourcing part of the application.

I've written tests for the CommandsHandlers, EventsHandlers and QueryHandlers. Most intresting parts of the code
live in the `products` module. The `products` module is a simple CRUD module that uses CQRS and Event Sourcing.

The in-memory EventStore is implemented is located top-level in the `src` folder. 

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