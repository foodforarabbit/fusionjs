FROM uber/web-base-image:10.15.3

RUN npm install -g npm@6.9.0

ARG UNPM_TOKEN

RUN mkdir /monorepo
WORKDIR /monorepo
COPY . /monorepo/

RUN echo "//unpm.uberinternal.com/:_auth = \${UNPM_TOKEN}" > ~/.npmrc && \
    echo "//unpm.uberinternal.com/:always-auth = true" >> ~/.npmrc && \
    echo "registry = https://unpm.uberinternal.com" >> ~/.npmrc && \
    git config --global user.name "Fake CI User" && \
    git config --global user.email "fakeciuser@uber.com" && \
    node common/scripts/install-run-rush install && \
    node common/scripts/install-run-rush build
