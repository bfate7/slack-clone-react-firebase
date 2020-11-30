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
import store from "./store";
import { connect, Provider } from "react-redux";
import { setUser, clearUser } from "./actions/userActions";
import Spinner from "./components/Spinner";

function App(props) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        props.setUser(user);
        return props.history.push("/");
      } else {
        props.history.push("/login");
        props.clearUser();
      }
    });
  }, [props]);

  return props.isLoading ? (
    <Spinner />
  ) : (
    <Switch>
      <Route path="/" component={Main} exact />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  );
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

const AppWithRouter = withRouter(
  connect(mapStateToProps, { setUser, clearUser })(App)
);

const AppWithAuth = () => (
  <Provider store={store}>
    <Router>
      <AppWithRouter />
    </Router>
  </Provider>
);

export default AppWithAuth;
