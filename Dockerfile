FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

COPY start.sh .
RUN chmod +x ./start.sh
CMD ["./start.sh"]