FROM node:21-alpine3.18

WORKDIR /icpedu-fabric-api

RUN sed -i "s/mongodb:\/\/localhost/mongodb:\/\/mongo/g" common/services/mongoose.service.js

RUN npm install

COPY . .

EXPOSE 3600

CMD ["npm", "run", "start"]
