FROM node:8

COPY ./src /src
COPY ./src/_docker/run.sh /run.sh
RUN cd /src &&\
  npm i

ENTRYPOINT ["bin/bash", "/run.sh"]