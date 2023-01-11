FROM node:lts-alpine

# curl for Healthcheck
RUN apk --no-cache add curl
#HEALTHCHECK --timeout=5s --interval=30s CMD curl --fail http://localhost:3000/health || exit 1

# Install npm
RUN npm install -g npm

# Working directory
WORKDIR /app

# Copy source
COPY . .

# npm config
RUN npm config set registry "https://registry.npmjs.org/"

# Install dependencies
RUN npm install .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
 && npm prune

# Start server
CMD ["npm", "start"]
