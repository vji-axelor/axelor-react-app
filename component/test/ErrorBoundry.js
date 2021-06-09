import React from "react";

class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hassError: false
    };
  }

  static getDerivedStateFromError(error) {
    console.log("error boundry calls ");
    return {
      hassError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      hassError: true
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hassError) {
        console.log("render from errorBoundry")
      return (
        <div>
          <h1>asdsadasdas</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundry;
