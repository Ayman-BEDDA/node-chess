# node-chess

## Description
node-chess is a Node.js application for playing chess. It provides a server-side implementation of the chess game logic and exposes a RESTful API for interacting with the game.

## Installation
1. Clone the repository:

```bash
git clone git@github.com:Ayman-BEDDA/node-chess.git
```

2. Install the dependencies:

```bash
npm install
```

3. Start the docker containers:

```bash
docker-compose up -d
```

4. Connect to MongoDB:

```bash
docker-compose exec mongo mongosh --username root --password password
```

5. Connect to PostgreSQL:

```bash
docker-compose exec db psql -U root -d app -h db
```

6. Do migrations (replace x with alter or force):
```bash
docker-compose exec server node migrate x
```