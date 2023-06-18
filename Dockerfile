FROM node:16

WORKDIR /MCDReforgedWebsiteFrontend
COPY . /MCDReforgedWebsiteFrontendBuild

RUN cd /MCDReforgedWebsiteFrontendBuild \
&& npm install \
&& npm run build \
&& mv .output/* /MCDReforgedWebsiteFrontend \
&& cd /MCDReforgedWebsiteFrontend \
&& rm -r /MCDReforgedWebsiteFrontendBuild

EXPOSE 3000

CMD ["node", "server/index.mjs"]
