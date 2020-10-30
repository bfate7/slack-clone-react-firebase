import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";

import {
  Grid,
  Header,
  Icon,
  Segment,
  Form,
  Message,
  Button,
} from "semantic-ui-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setErrors(["Fill in all fields"]);
    }

    setErrors([]);
    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(form.email, form.password)
      .then((signedInUser) => {
        setLoading(false);
        console.log(signedInUser);
      })
      .catch((err) => {
        setLoading(false);
        setErrors([err.message]);
      });
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
          Don't have an account <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
