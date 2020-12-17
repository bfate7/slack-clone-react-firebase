import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Main from "./components/Main";
import { useEffect } from "react";
import firebase from "./firebase";
import store from "./store";
import { connect, Provider } from "react-redux";
import { setUser, clearUser } from "./actions/userActions";
import Spinner from "./components/Spinner";

function App({ setUser, clearUser, history, isLoading }) {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        return history.push("/");
      } else {
        history.push("/login");
        clearUser();
      }
    });
  }, [clearUser, history, setUser]);

  return isLoading ? (
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
