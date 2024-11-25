FROM node:20 AS build

WORKDIR /app

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/api ./api
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

EXPOSE 8000

CMD ["npm", "start"]