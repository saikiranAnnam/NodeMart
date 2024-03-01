require("dotenv").config();

export default {
  port: process.env.PORT || 1337,
  dbUri: process.env.DB_URI,
  saltWorkFactor: 10,
  accessTokenTtl: "1y",
  refreshTokenTtl: "1y",
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
};
