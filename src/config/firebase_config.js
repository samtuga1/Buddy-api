require("dotenv").config({ path: ".env" });

const firebaseConfig = {
  apiKey: process.env.production.API_KEY,
  authDomain: process.env.production.AUTH_DOMAIN,
  projectId: process.env.production.PROJECT_ID,
  storageBucket: process.env.production.STORAGE_BUCKET,
  messagingSenderId: process.env.production.MESSAGING_SENDER_ID,
  appId: process.env.production.APP_ID,
};

module.exports = firebaseConfig;
