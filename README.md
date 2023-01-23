# ISO

ISO is a platform that helps photographers find and hire other photographers. This repository
contains the server and frontend packages for the ISO platform. The repository is hosted on GitHub
at https://github.com/jlamoreaux/iso

## Prerequisites

- Docker
- Node >=18.0.0
- Yarn

## Setup

Clone the repository and build the Docker image:

```bash

git clone https://github.com/jlamoreaux/iso.git
cd iso-app
docker-compose build

```

Start the Docker containers:

```bash
docker-compose up

```

This will start the server and database containers, and you can view the app at
http://localhost:5173.

To build the TypeScript files, run:

```bash
yarn build

```

To watch the TypeScript files and rebuild on changes, run:

```bash
yarn watch-ts

```

To start the server and frontend in development mode, run:

```bash
yarn dev

```

This will start both the server and frontend in development mode, with the frontend served on
port 5173.

To run the tests for the packages, run:

```bash
yarn test

```

## Structure

The monorepo contains the following packages:

- `server`: The backend of the ISO platform.
- `frontend`: The frontend of the ISO platform, served on port 5173 by default.

## Contributing

To contribute to the ISO monorepo, fork the repository and create a new branch for your changes.
When you are ready to submit your changes, create a pull request to merge your branch into the
`master` branch.
