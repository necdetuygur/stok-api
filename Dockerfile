FROM node:20-alpine
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . /home/node/app/.
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
