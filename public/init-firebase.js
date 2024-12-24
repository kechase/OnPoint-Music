//TODO: apply settings here from Github's secret tokens
// more info: https://firebase.google.com/docs/web/learn-more#config-object
var firebaseConfig = {
    apiKey: "${{FIREBASE_API_KEY}}",
    authDomain: "${{PROJECT_ID}}.firebaseapp.com",
    databaseURL: "https://${{DATABASE_NAME}}.firebaseio.com",
    projectId: "${{PROJECT_ID}}",
    storageBucket: "${{PROJECT_ID}}.firebasestorage.app",
    messagingSenderId: "${{SENDER_ID}}",
    appId: "${{APP_ID}}",
};

firebase.initializeApp(firebaseConfig); 