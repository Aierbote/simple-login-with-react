import React from "react";

/**
 * SOURCE: [about error boundary in React - DigitalOcean](https://www.digitalocean.com/community/tutorials/react-error-boundaries#encountering-errors-with-error-boundaries  "encountering errors with error boundaries")
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.logErrorToMyService(error.toString(), info.componentStack);
  }

  logErrorToMyService = console.log;

  render() {
    return this.state.hasError
      ? this.props.fallback || <div>Ops!</div>
      : this.props.children;
  }
}

export default ErrorBoundary;
