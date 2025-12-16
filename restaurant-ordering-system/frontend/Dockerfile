FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

# Bind to 0.0.0.0 so the host can reach the preview server and keep it on port 4173
CMD ["npm", "run", "preview", "--", "--host", "--port", "4173"]
