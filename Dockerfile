FROM uber/web-base-image:10.15.2

ARG UNPM_TOKEN

RUN mkdir /monorepo
WORKDIR /monorepo
COPY . /monorepo/

RUN echo "registry = https://unpm.uberinternal.com/" > .npmrc && \
    echo "_auth = \${UNPM_TOKEN}" >> .npmrc && \
    echo "email = unpm@uber.com" >> .npmrc && \
    echo "always-auth = true" >> .npmrc && \
    echo "loglevel = http" >> .npmrc && \
    node common/scripts/install-run-rush install && \
    node common/scripts/install-run-rush build
