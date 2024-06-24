# Use a Node.js Alpine base image
FROM node:20-alpine

ENV mongo_uri mongodb+srv://yashraj:Raj@cluster0.q1zhypd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV db_name oriondb
# Set working directory in the container
WORKDIR /home/yasmc

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy the entire project to the container (including init-replica.sh)
COPY . .

RUN chmod +x init-replica.sh

# Build your application
RUN yarn build

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 3000

# Set CMD to start your application
CMD ["yarn", "start"]
