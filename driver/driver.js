'use strict';

const { Consumer } = require('sqs-consumer');
const { Producer } = require('sqs-producer');
const uuid = require('uuid').v4;
//subscribes to packages sqs and publishes data to vendor sqs that package was delivered
const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/071028832536/packages',
    handleMessage: async (message) => {
      const msg = JSON.parse(message.Body);
      const order = JSON.parse(msg.Message);
      console.log('Picked up: ', order);
  
      setTimeout(async () => {
        const producer = Producer.create({
          queueUrl: order.vendorId,
          region: 'us-east-1'
        });
  
        await producer.send({
          id: uuid(),
          body: JSON.stringify(order)
        });
  
        console.log(`${order.orderId} delivered`);
      }, 5000)
    },
    pollingWaitTimeMs: 5000
  });
  
  app.start();