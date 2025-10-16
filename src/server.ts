import app from './app.ts';
import { sequelize } from './config/db.ts';
import './models/org.model.ts';
import './models/message.model.ts';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');


    await sequelize.sync();
    console.log('models synced');

    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('failed to start server:', err);
    process.exit(1);
  }
}

startServer();
