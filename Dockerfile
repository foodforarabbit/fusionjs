FROM uber/web-base-image:14.15.1-buster

RUN npm install -g npm@6.14.8

ARG UNPM_TOKEN

RUN echo "//unpm.uberinternal.com/:_auth = \${UNPM_TOKEN}" > ~/.npmrc && \
  echo "//unpm.uberinternal.com/:always-auth = true" >> ~/.npmrc && \
  echo "registry = https://unpm.uberinternal.com" >> ~/.npmrc && \
  echo "registry \"https://unpm.uberinternal.com\"" >> ~/.yarnrc && \
  git config --global user.name "Fake CI User" && \
  git config --global user.email "fakeciuser@uber.com" && \
  yarn global add jazelle@0.0.0-canary.eea8cca.0

RUN mkdir /monorepo
WORKDIR /monorepo
COPY . /monorepo/
