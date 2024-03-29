# dazn-coding-challenge

This service listens for requests relating to the active subscriptions that user might have. It allows a user to have 3 active (registered) subscriptions at anyone time.

# How To Run

This can be started in a number of ways. The following instructions assume the user is running on a linux based OS with a command line available.

## docker-compose

a `docker-compose.yml` is included with this project. `docker-compose up --build` will retrieve any images required for the project and will start the service.

Additionally a `docker-compose.override.yml` is included, this serves as an example of some of the config you might want to change and was used for convenience during dev. The current one uses the project's `streamer` directory as a volume for the service, leaving this means you will need to run `npm install` in the root of the `streamer` directory to install all dependencies that this project has.

A usefule environment variable to set in the override file is `DB_PROVIDER`. There are two options, `MEMORY_DB` and `MONGO_DB`.

## node .

If you want to run the service against an in-memory db you can just use the `node` command line utility. run `node .` from `streamer/src/` to start just the node

# Environment Variables

There is only one environment variable that is used in this service:

```
DB_PROVIDER
```

it can have two values

## `MEMORY_DB`

Setting `DB_PROVIDER=MEMORY_DB` will mean the in-memory mock db will used with the service. Each instance of the server will have it's own in-memory storage.

## `MONGO_DB`

Setting `DB_PROVIDER=MONGO_DB` will mean the mongodb provider will used with the service. The node.js service will then use the mongodb instance that is running. Each instance of the server will use the same mongodb instance.


# Assumptions

This was developed with so many assumptions, all of which fall under the assumption that this will not be used in a production environment.
A couple of deliberate ommissions were made when putting together this application, including mechanisms to authenticate users and queue/s for handling requests and responses.

# Tests

## unit/api tests

Unit tests of the DB provider are implemented using `jest` with many dependencies that these modules have mocked.

API tests for the subscription routes controller that are closer to being e2e regression tests are written using `supertest` and `jest`

all tests can be run using `npm run test` from a command line in the root directory of `./streamer/`

## Integration tests

Integration tests of the API against a MongoDB service are to be run seperately to the unit/api tests and require the service to be running in conjunction with the MongoDB instance. These tests are implemented using `jest` and `request` libs

To run the integration tests use docker-compose from the repository root dir:
```
docker-compose up
```

Then run `npm run test` from the `/tests/integration/` directory


# Scalability

Horizontal scaling at this point in this service life is not perfect, multiple instances of the streamer service can be created and managed through something like kubernetes, with each instance of the service would connect to the same instance of MongoDB. This means that when behind an appropriate load balancer, the service technically could handle high volumes of requests being sent.

In reality collisions from requests accessing/modifying the same instances of data could be an issue. When the application checks to see if anymore stream subscriptions can be registered, it is possible that a different stream subscription could be registered for a user after approving the first request but before it is completed. This could result in scenarios where a user manages to exceed the the 3 stream limit.

```
Given 4 running instances of the streamer service against 1 MongoDB instance,
When a request to add a subscription for the same user is made to all 4 instances at the same time,
Then all 4 subscriptions would succeed as at the point of validaiton, no subscriptions were registered
```

An approach that would reduce the impact of this would be to add check constraints at the database level, ensuring that no more than the allowed number of items exist. An alternative and potentially more scalable approach would be to use some form of message queue, which can be used to ensure requests are processed in the order which they are recieved.

The message queue approch means that services reliant on the streamer service for registering would issue a request for a subscription to be registered. Additional requests would then be required to see what requests are registered, the issuer of the request wouldn't know or be able to assume that a request has been registered successfully. The issuers could also subscribe to changes or a subsequent response queue, where the results of stream subscription requests could be queued up.