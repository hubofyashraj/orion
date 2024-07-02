# Use a Node.js Alpine base image
FROM node:20-alpine

# Set the working directory
WORKDIR /home/yasmc

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application files
COPY . .


ENV db_name=oriondb
# Install OpenSSH
RUN apk update && apk add openssh

# Configure SSH to allow password authentication
RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config
RUN echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config
RUN ssh-keygen -A
# Set root password (change 'your_password' to a secure password)
RUN echo "root:Raj" | chpasswd

# Give execute permissions to the run.sh script
RUN chmod +x ./run.sh

# Build the application
RUN npm run build

# Expose the application port and SSH port
EXPOSE 80
EXPOSE 22

# Use the run.sh script as the entry point
CMD ["./run.sh"]
