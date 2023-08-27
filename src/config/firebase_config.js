require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

module.exports = firebaseConfig;

// // const the functions you need from the SDKs you need

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCAER-EjJzbXWHxOvqt8McNw6YhoW9SbFY",
//   authDomain: "passco-2f09d.firebaseapp.com",
//   projectId: "passco-2f09d",
//   storageBucket: "passco-2f09d.appspot.com",
//   messagingSenderId: "712891125160",
//   appId: "1:712891125160:web:0d4669d6a14f888af9219d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
