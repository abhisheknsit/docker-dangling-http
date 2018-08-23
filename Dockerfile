FROM mhart/alpine-node:10

# Ensure application code makes it into the /app directory

WORKDIR /app
COPY ./ /app/
RUN export NODE_ENV=production && npm install

ENTRYPOINT ["./node_modules/pm2/bin/pm2-docker"]

CMD ["start", "./bin/start", "-i", "max"]
