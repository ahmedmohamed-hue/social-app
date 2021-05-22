FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install --pure-lockfile
# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . .
COPY .env.production .env

RUN yarn prisma generate
RUN yarn build

WORKDIR /usr/src/app/build

ENV NODE_ENV production

EXPOSE 8080

CMD [ "node", "src/index.js" ]
USER node
