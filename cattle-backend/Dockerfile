FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Production dependencies ke liye build optimize karein
RUN npm install --production

COPY . .

# Environment variable define karenge port ke liye (Render defaults to 10000 or dynamic)
ENV PORT=3000
EXPOSE ${PORT}

# Application ko start karne ka tarika
CMD ["npm", "start"]