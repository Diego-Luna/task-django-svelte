FROM node:iron

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy app files
COPY . .

# Start development server
EXPOSE 5000
CMD ["npm", "run", "dev"]