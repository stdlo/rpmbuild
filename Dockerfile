FROM centos:7

ENV FLAVOR=rpmbuild OS=centos DIST=el7

COPY . .

RUN yum install -y rpm-build rpmdevtools gcc make coreutils python
RUN yum -y clean all

# Download extract and install nodejs
RUN curl -O https://nodejs.org/dist/v12.19.1/node-v12.19.1-linux-x64.tar.xz
RUN tar --strip-components 1 -xvf node-v* -C /usr/local

RUN npm install --production

# ENTRYPOINT ["node", "/lib/main.js"]
ENTRYPOINT ["ls"]

