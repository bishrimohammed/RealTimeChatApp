import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  username: "root",
  // password: "your_password",
  database: "chatdb",
  logging: true, // change this to true to see SQL queries in console
});
// async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
//   sequelize
//     .sync()
//     .then(() => {
//       console.log("Database & tables created!");
//     })
//     .catch((error) => {
//       console.error("Error creating database & tables:", error);
//     });
// };
// (async () => {
//   console.log("hello");

//   sequelize
//     .sync({ alter: false })
//     .then(() => {
//       console.log("Database & tables created!");
//     })
//     .catch((error) => {
//       console.error("Error creating database & tables:", error);
//     });
// })();
export { sequelize };
