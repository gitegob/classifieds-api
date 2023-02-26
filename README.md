# Classifieds API

## Description

An API where sellers can add products to be viewed by other customers.

## Features

- A seller must authenticate first
- A seller wants to create a new products
- Product model should include the name, price, short description, image/logo, and the manufacturing date
- A seller must select a category (Must be predefined as well)
- Customer wants to be able to view a list of all products image, name, price and manufacturing date.
- The list should show only the first 10 items
- The list should be sorted alphabetically.
- The customer should be able to select a product and view details.

## Installation

```bash
$ yarn install
```

## Running the app

### Prerequisites

- Create a `.env` file and add the contents of the `.env.sample` file replacing the value of `POSTGRES_HOST` to `localhost`
- Make sure that you have a database running named `classifieds`, if not create it.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Running in docker

### Prerequisites

- Create a `.env` file and add the contents of the `.env.sample` file.

```bash
$ docker build -t classifieds-api .
$ docker-compose up
```

## Stay in touch

- Author - [Brian Gitego](mailto:gitegob@mail.com)
