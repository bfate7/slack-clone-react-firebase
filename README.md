# Slack Clone builed with react and firebase

---

simple slack clone build with react, redux and firebase.

notice: <br/>
the app need some code optimisation and some styles fixes.

---

### Table of content

&nbsp;

- Installation
- congiguration
- build & deploy

&nbsp;

### Installation

&nbsp;

```
npm install
```

or

```
yarn install
```

&nbsp;

### Configuration

&nbsp;

- create new project on firebase & copy your configuration to "./scr/firebase.js"

&nbsp;
&nbsp;

```javascript
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
```

&nbsp;

### build & deploy

&nbsp;

- build the app

```
npm/yarn  build
```

- install firebase tools

```
npm install -g firebase-tools buid
```

- login to firebase

```
firebase login
```

- initialize firebase project

```
firebase init
```

- select the folowing firebase feautures : <br />

1. Database (Realtime Database).
2. Hosting.
3. Storage.

- choose > "Use an existin gproject" and select your project
- choose Database Security Rules json file
- set tour public directory to "build"
- you will be asked the followin question type "Yes"

```
"Configure as a single-page app (rewrite all urls to /index.html)?"
```

- type "No" for automatic builds with github
- type "No" for "overwrite "public/index.html"
- choose Storage Rules json file

&nbsp;
&nbsp;

## finally deploy your app with this command

```
firebase deploy
```
