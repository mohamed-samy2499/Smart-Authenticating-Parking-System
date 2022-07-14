# build environment
FROM node:alpine as build

COPY ./api-models ../api-models
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
# COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@5.0.0 -g --silent
COPY . ./
RUN npm run build

# COPY ./nginx.conf ./build/nginx.conf

# production environment
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]