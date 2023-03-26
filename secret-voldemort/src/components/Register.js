import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { register } from "../actions/auth";
import "./css/Register.css"

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          This is not a valid email.
        </div>
      );
    }
  };

const Register = (props) => {
  const {history} = props;
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };
 
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);
    
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(username, password, email, photo))
        .then(() => {
          setSuccessful(true);
          setLoading(false);
        })
        .catch(() => {
          setSuccessful(false);
          setLoading(false);
        });
    }
  };
  
  const handlePush = () => {
    if(successful) {
      history.push("/login");
    }
  };

  return (
    <div className="screen">
      <div className="register">
        <div className="register-screen">
          <div className="app-title">
            <h1>Register</h1>
          </div> 

          <Form onSubmit={handleRegister} ref={form}>
            {!successful && (
              <div class="login-form">
                <div className="control-group">
                  <h3 className="login-field-icon app-title" htmlFor="username">Username</h3>
                  <Input
                    type="text"
                    className="login-field"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>
              
                <div className="control-group">
                  <h3 className="login-field-icon app-title" htmlFor="password">Password</h3>
                  <Input
                    type="password"
                    className="login-field"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="control-group">
                  <h3 className="login-field-icon app-title" htmlFor="email">Email</h3>
                  <Input
                    type="text"
                    className="login-field"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required, validEmail]}
                  />
                </div>

                <div className="content-buttons">
                  <button className="btn-signUp" disabled={loading} onClick={handlePush}>
                  {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                   )}
                  Sign Up
                  </button>
                  <button onClick={() => history.push("/login")} className="btn-signIn">Sing In </button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
      </div>
      
    </div>
  );
};

export default Register;