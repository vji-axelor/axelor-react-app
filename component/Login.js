import React from "react";
import ReactDOM from "react-dom";
import "./../App.css";
import axios from "axios";
import "./../login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };

    this.changeInputHandler = this.changeInputHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  changeInputHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  submitHandler(e) {
    e.preventDefault();

    axios
      .post(
        "/axelor-erp/login.jsp",
        {
          username: this.state.username,
          password: this.state.password
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          withCredentials: true
        }
      )
      .then(response => {
        // console.log(response);
        this.props.login(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  testFechData() {
    axios
      .post(
        "/axelor-erp/ws/rest/com.axelor.apps.rku.db.Account/8/fetch",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          withCredentials: true
        }
      )
      .then(response => {
        console.log(response.data.data[0]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { username, password } = this.state;

    return ReactDOM.createPortal(
      <div className="Login-div-content">
        <div className="Login-axelor">
          <h1>
            a<span className="Login-axelor-span">X</span>elor
          </h1>
        </div>
        {/* <hr className="Login-hr" /> */}

        <div className="Login-div Login-div-shadow">
          <form onSubmit={this.submitHandler}>
            <label>uasename</label>
            <br />
            <input
              className="Login-input"
              type="Text"
              value={username}
              name="username"
              onChange={this.changeInputHandler}
            />
            <br />
            <br />

            <label>password</label>
            <br />
            <input
              className="Login-input"
              type="password"
              name="password"
              value={password}
              onChange={this.changeInputHandler}
            ></input>
            <br />
            <br />

            <button type="submit" className="Login-button Button-field">
              Login
            </button>
          </form>
          {/* <button onClick={this.testFechData.bind(this)} className="Login-button Button-field">Test</button> */}
        </div>
      </div>,
      document.getElementById("login")
    );
  }
}

export default Login;
