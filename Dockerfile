FROM node:20.9.0-alpine3.18

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN sed -i "s/mongodb:\/\/localhost/mongodb:\/\/mongo/g" common/services/mongoose.service.js

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
