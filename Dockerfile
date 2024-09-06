FROM node:alpine3.20

# create user app & set user
RUN addgroup app && adduser -S -G app app
USER app

# set working directory
WORKDIR /app

# install project dependencies
COPY --chown=app:app package*.json .
RUN npm install

# copy the rest of the files to working directory
COPY --chown=app:app . .

# expose port
EXPOSE 3000

# run runtime commands in shell
CMD ["npm", "start"]