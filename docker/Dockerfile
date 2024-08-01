FROM node:22.4.0-alpine3.20 as builder

WORKDIR /

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install

COPY . .

RUN npm run build

FROM node:22.4.0-alpine3.20 as runner

RUN npm install -g pm2

WORKDIR /app

COPY --from=builder /dist ./dist
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
COPY --from=builder /tsconfig.json ./tsconfig.json

EXPOSE 3000

ENTRYPOINT ["sh", "-c", "npm run start:prod"]