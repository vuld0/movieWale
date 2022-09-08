const express = require('express');
require('dotenv').config();
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.APP_PORT;
const REDIS_PORT = process.env.REDIS_PORT;

//create the redis client
const client = redis.createClient({
    host: 'localhost',
    port: REDIS_PORT
});

async function redisJSONDemo () {
    try {
      const TEST_KEY = 'test_node';
  
      // explicit call to connect to Redis Database
      await client.connect();
  
      await client.on('connect', ()=>{
          console.log('connected');
      });
  
      // RedisJSON uses JSON Path syntax. '.' is the root.
      await client.json.set(TEST_KEY, '.', { node: 'blah blah black sheep' });
      const value = await client.json.get(TEST_KEY, {
        // JSON Path: .node = the element called 'node' at root level.
        path: '.node'
      });
  
      console.log(`value of node: ${value}`);
  
      await client.quit();
    } catch (e) {
      console.error(e);
    }
  }
  
  redisJSONDemo();

app.get('/', (req, res) => {
    res.send('GET called!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port:${PORT}`);
});