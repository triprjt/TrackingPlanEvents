FROM node:15.13-alpine

WORKDIR /frontend

ENV PATH = "./node_modules/.bin:$PATH"
COPY . .

RUN rm -rf node_modules
RUN rm -f package-lock.json
RUN rm -f yarn.lock
RUN npm install
RUN npm run build

# RUN yarn
# RUN yarn build

# CMD ["npm", "start"]
# ENTRYPOINT ["sh", "/app/entrypoint.sh"]