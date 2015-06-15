FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y curl

#MongoDB
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
    apt-get update
RUN apt-get install -y mongodb-org
RUN mkdir -p /data/db

#Node
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN ln -s /usr/bin/nodejs /usr/local/bin/node
RUN npm install -g npm
RUN npm install -g n
RUN n stable

COPY . /srv
WORKDIR /srv/

RUN npm install

CMD npm start
