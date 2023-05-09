FROM node:16

WORKDIR /MCDReforgedWebsite
COPY . /MCDReforgedWebsite

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
