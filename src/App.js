import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Main from "./components/Main";
import { useEffect } from "react";
import firebase from "./firebase";

function App(props) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.history.push("/");
      }
    });
  }, [props.history]);

  return (
    <Switch>
      <Route path="/" component={Main} exact />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
}

const AppWithRouter = withRouter(App);

const AppWithAuth = () => (
  <Router>
    <AppWithRouter />
  </Router>
);

export default AppWithAuth;
