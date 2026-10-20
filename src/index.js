require('dotenv').config()
const app = require('./app');
const { conectar } = require('./config/config');

const PORT = process.env.PORT || 3000

async function arrancar() {
    await conectar();

    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`)
    });
}

arrancar().catch(error => {
    console.error(error.message);
    process.exit(1);
});
