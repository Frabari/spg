# Basil backend

## Description

Created using [Nest](https://github.com/nestjs/nest) framework TypeScript starter.

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

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## DB seed

To seed the db with test data first run the app at least once:

```shell
$ npm run start:dev
```

and then run

```shell
$ npm run db:seed
```

> ⚠️ The db must be empty for this to work properly. If it's not: delete the .sqlite file and repeat the steps above

## Project structure

```
backend
├── src
│   ├── app.controller.spec.ts              App module components
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── features                            Feature modules
│   │   ├── products                        Feature module example
│   │   :   ├── product.entity.ts           The main entity managed by this module
│   │       ├── products.controller.ts      The controller where all the subroutes of /products are declared
│   │       ├── products.controller.spec.ts Controller unit tests
│   │       ├── products.service.ts         The service expoting all the logic
│   │       ├── products.service.spect.ts   Service unit tests
│   │       └── products.module.ts          Nest (sub)module definition
│   └── main.ts
├── test                                    End to end tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json                     TypeScript configurations
└── tsconfig.json
```
