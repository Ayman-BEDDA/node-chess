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

7. Do fixture:
```bash
docker-compose exec server node fixtures/index.js
```

# Projet de Test unitaire et fonctionnel
Dans le cadre du projet nous avons réalisé 4 types de tests (Unitaire, Intégration, sécurité et performance) et nous avons mis en place l'intégration continue sur notre répertoire Github.

## Intégration continue
Notre fichier d'intégration continue se trouve dans /.github/workflow/ci.yml
Notre intégration continue réalise l'ensemble des tests présents sur notre projet.

## Tests unitaires et d'intégration
Nous avons réalisé les tests unitaires avec jest et node-mocks-http, en ce qui concerne les tests d'intégration nous les avons réalisés avec supertest.
Afin de différencier les tests unitaires aux tests d'intégration, les fichiers de tests d'intégration possèdent le mot "http" dans leurs noms.
Les tests unitaires et d'intégration se trouvent dans le dossier /server/test.
Il est possible de faire les tests en local.

### Lancer les tests
Lancer les migrations

```bash
  docker-compose exec server node migrate force
```
Lancer les fixtures

```bash
  docker-compose exec server node fixtures/index.js
```
Lancer les tests

```bash
  docker-compose exec server npm test
```

## Test de sécurité
Afin de réaliser un test de sécurité nous utilisons Snyk, qui va réaliser un test des dépendances installé sur notre projet. 
Ce test est effectué par notre intégration continue, lors d'un push ou d'une pull request.

## Test de performances
Afin de réaliser un test de performances nous utilisons Artillery.
Nous utilisons deux fichiers pour réaliser ce test data.csv et loadtest.yml.
Ce test réalise "l'inscription" de 100 utilisateurs.
Pour des raisons de sécurité il n'est pas possible d'effectuer le test de performances en local, le test est réalisé dans l'intégration continue, nous installons la dépendance Artillery dans notre intégration continue.
## Authors

- [@Ayman-BEDDA](https://github.com/Ayman-BEDDA)
- [@Maxime-Lao](https://github.com/Maxime-Lao)
- [@muthuxv](https://github.com/muthuxv)
- [@SimonBTSSio](https://github.com/SimonBTSSio)