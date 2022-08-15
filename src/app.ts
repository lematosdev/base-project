import express, { json } from 'express';
import helmet from 'helmet';

import getSignedUrl from './functions/getSignedURL';
import uploadFile from './functions/uploadFile';

const app = express();
app.use(json({ limit: '50mb' }));
app.use(helmet());

app.get('/', (_, res) => {
  res.json({
    msg: 'Hello World',
  });
});

app.get('/get', async (req, res) => {
  const { fileName } = req.query;

  if (!fileName) {
    res.status(400).json({
      msg: 'Missing fileName',
    });
    return;
  }

  const fileURL = await getSignedUrl(String(fileName));

  res.json({
    url: fileURL,
  });
});

app.post('/upload', async (req, res) => {
  const { base64 } = req.body;
  const { fileName } = req.body;

  if (!base64) {
    res.status(400).json({
      msg: 'Missing base64',
    });
    return;
  }
  if (!fileName) {
    res.status(400).json({
      msg: 'Missing fileName',
    });
    return;
  }

  try {
    const file = await uploadFile(base64, fileName);
    res.json({
      url: file,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
});

app.use((_, res, _2) => {
  res.status(404).json({ error: 'NOT FOUND' });
});

export { app };
