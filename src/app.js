import express from 'express';
import { config } from 'dotenv';
import path from 'path';
config();

const app = express();

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
