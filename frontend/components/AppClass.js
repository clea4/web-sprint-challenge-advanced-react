// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from "react";

const initialState = {
  message: "",
  email: "",
  index: 4, // The "B" starts at index 4.
  steps: 0,
};

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  getXY = () => {
    const x = (this.state.index % 3) + 1;
    const y = Math.floor(this.state.index / 3) + 1;
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    const { index } = this.state;
    const row = Math.floor(index / 3);
    const col = index % 3;

    switch (direction) {
      case "up":
        return row > 0 ? index - 3 : index;
      case "down":
        return row < 2 ? index + 3 : index;
      case "left":
        return col > 0 ? index - 1 : index;
      case "right":
        return col < 2 ? index + 1 : index;
      default:
        return index;
    }
  };

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState({
        index: nextIndex,
        steps: this.state.steps + 1,
        message: "",
      });
    } else {
      this.setState({ message: `You can't go ${direction}` });
    }
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    if (!this.state.email) {
      this.setState({ message: "Ouch: email is required" });
      return;
    }

    const payload = {
      x: this.getXY().x,
      y: this.getXY().y,
      steps: this.state.steps,
      email: this.state.email,
    };

    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Something went wrong");
          });
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ message: data.message, email: "" });
      })
      .catch((error) => {
        this.setState({ message: error.message || "Error: Could not submit" });
      });
  };

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}