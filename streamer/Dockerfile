FROM index.docker.io/node:10 AS base
WORKDIR /home/node/app

FROM base AS dependencies
COPY package.json .
RUN npm install

FROM dependencies AS pre-build
COPY src ./src

FROM pre-build AS test
# RUN npm test --coverage

