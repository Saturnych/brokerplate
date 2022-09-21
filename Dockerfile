FROM node:lts-alpine

# Working directory
WORKDIR /dist

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
RUN npm run build \
 && npm prune

# Healthcheck
RUN apk --no-cache add curl
HEALTHCHECK --timeout=5s --interval=30s CMD curl --fail http://localhost:3000/api/v1/greeter/health || exit 1

# Start server
CMD ["npm", "start"]
