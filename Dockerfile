FROM node:16

WORKDIR /MCDReforgedWebsiteFrontend
COPY . /MCDReforgedWebsiteFrontend

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
