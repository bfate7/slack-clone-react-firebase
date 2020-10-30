import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import firebase from "../firebase";
import md5 from "md5";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();

    const isFormValid = () => {
      setErrors([]);
      if (
        !form.username ||
        !form.email ||
        !form.password ||
        !form.password_confirmation
      ) {
        setErrors(["Fill in all fields"]);
        return false;
      } else if (form.password.length < 6) {
        setErrors(["Password must be at least 6 caracters"]);
        return false;
      } else if (form.password !== form.password_confirmation) {
        setErrors(["Passwords doesn't match"]);
        return false;
      }
      return true;
    };

    const saveUserToDB = (firebaseUser) => {
      const usersRef = firebase.database().ref("users");
      return usersRef.child(firebaseUser.user.uid).set({
        username: firebaseUser.user.displayName,
        avatar: firebaseUser.user.photoURL,
      });
    };

    if (isFormValid()) {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)
        .then((createdUser) => {
          createdUser.user
            .updateProfile({
              displayName: form.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUserToDB(createdUser);
              console.log("user saved:");
            })
            .catch((err) => {
              setErrors(err);
              console.log(err);
            });
        })

        .then(() => {
          setLoading(false);
          setErrors([]);
        })
        .catch((err) => {
          setErrors([err.message]);
          setLoading(false);
        });
    }
  };
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: "450px" }}>
        <Header as="h2" icon color="blue" textAlign="center">
          <Icon name="code" color="blue" />
          Register for DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              value={form.username}
            />
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
            />
            <Form.Input
              fluid
              name="password"
              type="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
            />
            <Form.Input
              fluid
              name="password_confirmation"
              type="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password confirmation"
              onChange={handleChange}
              value={form.password_confirmation}
            />
            <Button
              fluid
              color="blue"
              className={loading ? "loading" : ""}
              disabled={loading}
            >
              Submit
            </Button>
          </Segment>
        </Form>

        {errors.length > 0 && (
          <Message color="red">
            {errors.map((err, i) => (
              <span key={i}>{err}</span>
            ))}
          </Message>
        )}

        <Message>
          Already a user <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
