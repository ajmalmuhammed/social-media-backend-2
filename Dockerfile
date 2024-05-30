FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./

COPY src ./src

# RUN npm run build
# CMD ["npm","run","start"]

CMD ["npm", "run", "dev"]
# CMD [ "node", "dist/index.js" ]


