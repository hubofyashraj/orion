# Use a Node.js Alpine base image
FROM node:20-alpine


ENV mongo_uri mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?retryWrites=true&w=majority&appName=Cluster0
ENV db_name oriondb
# Set working directory in the container
WORKDIR /home/yasmc


# Copy package.json and yarn.lock to install dependencies
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the entire project to the container (including init-replica.sh)
COPY . .

RUN chmod +x ./run.sh
# Build your application
RUN npm run build

# Expose port 3000 (assuming your application listens on this port)
EXPOSE 3000

# Set CMD to start your application
CMD ["./run.sh"]
