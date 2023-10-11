FROM cypress/included


RUN mkdir /app
WORKDIR /app

RUN  apt-get update && apt-get install -y \
    vim \
    gcc \
    gdb \ 
    strace \
    lsof \
    file \
    less \ 
    lldb
COPY cypress ./cypress
COPY cypress.config.js .
COPY package.json .
COPY package-lock.json .
COPY currents.config.js .
RUN Xvfb :99 & export DISPLAY=:99
EXPOSE 9229

CMD ["sh"]