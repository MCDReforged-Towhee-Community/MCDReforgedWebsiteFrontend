FROM node:16

WORKDIR /MCDReforgedWebsiteFrontend
COPY . /MCDReforgedWebsiteFrontendBuild

RUN npm install
RUN npm run build
RUN mv .output/server/* /MCDReforgedWebsiteFrontend \
&& rm /MCDReforgedWebsiteFrontendBuild

EXPOSE 3000

CMD ["node", "index.mjs"]
