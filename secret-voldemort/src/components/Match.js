import React, {useState, useRef}  from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { match } from "../actions/match";
import "./css/Match.css";

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };
  

const Match = (props) => {

    const form = useRef();
    const checkBtn = useRef();

    const [name_match, SetName_match] = useState("");
    const [nickname, SetNickname] = useState("");
    const [matchLoading, setMatchLoading] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();

    const onChangeNameMatch = (e) => {
        const name_match = e.target.value;
        SetName_match(name_match);
    };

    const onChangeNickName = (e) => {
        const nickname = e.target.value;
        SetNickname(nickname);
    };

    const handleCreateMatch = (e) => {
      e.preventDefault();
  
      setMatchLoading(true);
  
      form.current.validateAll();
  
    
    if (checkBtn.current.context._errors.length === 0) {
        dispatch(match(name_match, nickname, currentUser.user_name))
          .then(() => {
            props.history.push(`/game/${name_match}`);
          })
          .catch(() => {
            setMatchLoading(false);
          });
        } else {
          setMatchLoading(false);
      }
    };

  return (
    <div className="screen">
    <div className="match">
      <div className="match-screen">
        <div className="app-title">
          <h1>Create Match</h1>
        </div>  
          <Form onSubmit={handleCreateMatch} ref={form}>    
            <div className="login-form">
              <div class="control-group">
                <h3 className="login-field-icon app-title" htmlFor="name_match">Name match</h3>
                <Input
                  type="text"
                  className="login-field"
                  name="name_match"
                  value={name_match}
                  onChange={onChangeNameMatch}
                  validations={[required]}
                />
            </div>    
            <div className="form-group">
              <h3 className="login-field-icon app-title" htmlFor="nickname">Nickname</h3>
              <Input
                type="text"
                className="login-field"
                name="nickname"
                value={nickname}
                onChange={onChangeNickName}
                validations={[required]}
              />
            </div>    
            <div className="form-group">
              <button className="btn" disabled={matchLoading}>
                {matchLoading && (
                  <span className="spinner-border spinner-border-sm"></span>
                  )}
                <span>Create</span>
              </button>
            </div>    
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            </div>
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Match;