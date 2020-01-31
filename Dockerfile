FROM uber/web-base-image:12.13.0

RUN npm install -g npm@6.12.0

ARG UNPM_TOKEN

RUN echo "//unpm.uberinternal.com/:_auth = \${UNPM_TOKEN}" > ~/.npmrc && \
  echo "//unpm.uberinternal.com/:always-auth = true" >> ~/.npmrc && \
  echo "registry = https://unpm.uberinternal.com" >> ~/.npmrc && \
  echo "registry \"https://unpm.uberinternal.com\"" >> ~/.yarnrc && \
  git config --global user.name "Fake CI User" && \
  git config --global user.email "fakeciuser@uber.com" && \
  yarn global add jazelle@0.0.0-canary.9d17ba2.0

RUN mkdir /monorepo
WORKDIR /monorepo
COPY . /monorepo/
