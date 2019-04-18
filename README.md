# Make It SaaS - Service

This is the framework to develop API for a multi-service architectures. Main features :
* Authentication using a separated oauth server (with jwt and jwk)
* Database ORM
* Cache
* Queues (Pub/Sub)

## Prerequisites

1. CLI programs :
* `npm:  >=6.7.0`
* `docker:  >=18.09.2`
* `docker-compose: >=1.24.0`
 
2. Make it SaaS [devkit](https://github.com/makeitsaas/makeitsaas-devkit) (one per machine)
3. One [authentication service](https://github.com/makeitsaas/makeitsaas-auth-instance) (one per project)

## Getting started

3. Then you can setup your new service :

```
npm install makeitsaas --save
node ./node_modules/makeitsaas/bin/cli init-project
cp .env.dist .env 
npm start
```

Then the server shall be running on port `:3000` (change `PORT` value in `.env`).
```
curl http://localhost:3000 
# App is up and running
```

## Resolvers

Functions that can be binded to routes and have access to the ResolverContext :

```
context = {
  request: {headers, body, params, query, tracker}, # usual parameters but might only be tracker because headers determines the function to call and body its arguments
  var: {}, # custom variables
  user: {},
  services: {},
  models: {},
  databases: {
    db_name: {queryPool, sequelize, ...}
  },
  cache: {get, set},
  queue: {emit, codes},  # listen se paramètre dans la config, qui appelle un hook
  notify: {send},
  health: {check(serviceName)}
}
```

Example :

```yaml
# PROJECT_PATH/config/config.yml
- get: /test/authentication
  handler: handler-example.testResolve
  security: security.rule1
```

