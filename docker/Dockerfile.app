
ARG DEBIAN_RELEASE=bookworm

FROM dev-base:${DEBIAN_RELEASE}

ARG DEBIAN_RELEASE
ARG OUTER_USER

EXPOSE 3000

USER root

COPY docker/app/entrypoint.sh /docker-entrypoint.sh

RUN true \
 && apt-get update \
 && apt-get -y install \
    nodejs \
    node-typescript \
    npm \
    ts-node \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists \
 && chmod +x /docker-entrypoint.sh \
 && true

USER    ${OUTER_USER}
