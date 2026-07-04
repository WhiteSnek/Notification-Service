import express, {Express} from 'express'
import dotenv from 'dotenv';
import helmet from "helmet";
import { requestLogger } from './utils/requestLogger';
import serverless from "serverless-http";
import router from './routes'
dotenv.config({
  path: './.env'
});

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(requestLogger)
app.use('/api', router)
app.get('/', (req,res) => {
    res.send('Everything working fine!');
})

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export const handler = serverless(app, {
  basePath: "/v1",
});