FROM rabbitmq:3.8.4-rc.3-management

ADD definitions.json /etc/rabbitmq/
ADD rabbitmq.config /etc/rabbitmq/

RUN rabbitmq-plugins enable rabbitmq_shovel
RUN rabbitmq-plugins enable rabbitmq_shovel_management

EXPOSE 4369 5672 25672 15672