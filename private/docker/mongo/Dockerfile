#################
#
# Builds a Meteor + MongoDB Docker Image
#
# Usage:
#  Build:
#    docker build -t dank/company .
#
#  Run Meteor + local mongo:
#
#  docker run --rm -p ::3000 \
#    -e ROOT_URL="http://localhost" \
#    -e METEOR_EMAIL="youradmin@yourdomain.com" \
#    -e METEOR_USER="admin" \
#    -e METEOR_AUTH="password" \
#    -t dank/company
#
#
#  Optional Meteor parameters (-e):
#
#    ROOT_URL="<hostname"
#    MONGO_URL="<mongo connect string>"
#    OPLOG_URL="<mongo oplog url>"
#    PORT="<meteor port>"
#    METEOR_SETTINGS="{json}"
#    DISABLE_WEBSOCKETS="1"
#
#  Company Specific parameters (-e):
#
#    MAIL_URL="<smtp connection string"
#    METEOR_EMAIL="youradmin@yourdomain.com"
#    METEOR_USER="admin"
#    METEOR_AUTH="password"
#
################

FROM debian:wheezy
MAINTAINER Dan Kirkpatrick <dan.kirkpatrick@gmail.com>

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r mongodb && useradd -r -u 1000 -g mongodb mongodb

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates curl \
		numactl \
	&& rm -rf /var/lib/apt/lists/*

# grab gosu for easy step-down from root
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN curl -o /usr/local/bin/gosu -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" \
	&& curl -o /usr/local/bin/gosu.asc -SL "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture).asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

# gpg: key 7F0CEB10: public key "Richard Kreuter <richard@10gen.com>" imported
RUN apt-key adv --keyserver ha.pool.sks-keyservers.net --recv-keys 492EAFE8CD016A07919F1D2B9ECBEC467F0CEB10

ENV MONGO_MAJOR 3.0
ENV MONGO_VERSION 3.0.4

RUN echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/$MONGO_MAJOR main" > /etc/apt/sources.list.d/mongodb-org.list

RUN set -x \
	&& apt-get update \
	&& apt-get install -y \
		mongodb-org=$MONGO_VERSION \
		mongodb-org-server=$MONGO_VERSION \
		mongodb-org-shell=$MONGO_VERSION \
		mongodb-org-mongos=$MONGO_VERSION \
		mongodb-org-tools=$MONGO_VERSION \
	&& rm -rf /var/lib/apt/lists/* \
	&& rm -rf /var/lib/mongodb \
	&& mv /etc/mongod.conf /etc/mongod.conf.orig

RUN mkdir -p /data/db && chown -R mongodb:mongodb /data/db
VOLUME /data/db

COPY docker-entrypoint.sh /entrypoint.sh
COPY data/db/* /data/db/
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 27017
EXPOSE 28017
CMD ["mongod"]
