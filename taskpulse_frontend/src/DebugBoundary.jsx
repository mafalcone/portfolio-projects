import React from "react";

export default class DebugBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  static getDerivedStateFromError(err) {
    return { err };
  }

  componentDidCatch(err, info) {
    console.error("Runtime error:", err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 16, fontFamily: "monospace" }}>
          <h2 style={{ color: "red" }}>Runtime error</h2>
          <pre>{String(this.state.err?.stack || this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
