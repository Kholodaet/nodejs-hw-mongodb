import express from 'express';
import cors from 'cors';
import logger from './db/logger/logger.js';

import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(logger);

  app.use(express.json());

  // Додаємо кореневий маршрут
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Contacts API!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).send({
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((error, req, res) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  const PORT = Number(env('PORT')) || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
