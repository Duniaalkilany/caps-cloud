'use strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const { Consumer } = require('sqs-consumer');

const uuid = require('uuid').v4;
const faker = require('faker');
const sns = new AWS.SNS();

// sets topic to arn of sns
const topic = 'arn:aws:sns:us-east-1:071028832536:pickup';



//creates new order and sends payload to sns

    const order = {
        orderId: uuid(),
        customer: faker.name.findName(),
        vendorId: 'https://sqs.us-east-1.amazonaws.com/071028832536/packages'
      };

      const payload = {
        TopicArn: topic,
        Message: JSON.stringify(order)
    
      };
//   console.log(payload);

setInterval(() => {
    sns.publish(payload).promise()
      .then(data => {
        console.log(data);
      })
      .catch(console.error);
    ;
  
  }, 5000);

//subsribes to vendor sqs and logs that it was delivered
const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/071028832536/packages',
    handleMessage: async (message) => {
      console.log(message.Body);
    }
  });
  
  app.start();

