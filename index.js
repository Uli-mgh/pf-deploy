const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { getProducts } = require("./src/middlewares/middlewares");

const { PORT } = process.env;

conn.sync({ force: true }).then(() => {
  server.listen(PORT, async () => {
    await getProducts();
    console.log(`%s listening at ${PORT}`);
  });
});
