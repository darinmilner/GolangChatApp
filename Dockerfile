FROM golang:latest

WORKDIR /home/app/dist

COPY . /home/app/dist

RUN go mod download

RUN go build

EXPOSE 3001

CMD ./app