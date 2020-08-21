FROM node:12-alpine AS build
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
RUN yarn tsc

FROM gcr.io/distroless/nodejs:12
WORKDIR /app
COPY --from=build /app .
CMD ["dist/index.js"]
