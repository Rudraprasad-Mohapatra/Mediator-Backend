FROM node:22

# Create app directory
WORKDIR /mediator_node_app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]