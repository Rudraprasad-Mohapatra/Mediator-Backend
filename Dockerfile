FROM node:22

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]