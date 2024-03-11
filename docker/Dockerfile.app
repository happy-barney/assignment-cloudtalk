
ARG DEBIAN_RELEASE=bookworm

FROM dev-base:${DEBIAN_RELEASE}

ARG DEBIAN_RELEASE
ARG OUTER_USER

EXPOSE 3000

USER root

RUN true \
 && apt-get update \
 && apt-get -y install \
    nodejs \
    node-typescript \
    npm \
    ts-node \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists \
 && true

USER    ${OUTER_USER}
