import React from "react";
import axios from "axios";
import "./App.css";
import Login from "./component/Login";
import TestHome from "./component/test/TestHome";
import ErrorBoundry from "./component/test/ErrorBoundry";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: false
    };
  }
  
  loginStatus = response => {
    console.log(response.status);

    response.status === 200 &&
      this.setState({
        isLogin: true
      });
  };

  componentDidMount() {
    axios
      .get(
        "/axelor-erp/ws/app/info",
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
        console.log(response.data["user.login"]);

        response.data["user.login"] !== undefined &&
          this.setState({
            isLogin: true
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { isLogin } = this.state;
    return (
      <div>
        {/* {isLogin ? <Home /> : <Login login={this.loginStatus} />} */}
        {isLogin ? (
          <ErrorBoundry>
            <TestHome />
          </ErrorBoundry>
        ) : (
          <ErrorBoundry>
            <Login login={this.loginStatus} />
          </ErrorBoundry>
        )}
      </div>
    );
  }
}

export default App;
