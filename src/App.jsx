import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import * as Icon from "react-bootstrap-icons";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuote: {},
      currentQuoteHold: {},
      twitterLink: "",
      prevHexColor: "black",
      hexColor: "blue",
      fadeOut: false,
      animationKey: 0,
    };
    this.getRandomQuote = this.getRandomQuote.bind(this);
    this.makeTwitterLink = this.makeTwitterLink.bind(this);
    this.changeColors = this.changeColors.bind(this);
  }

  componentDidMount() {
    this.getRandomQuote();
  }

  getRandomQuote = async () => {
    try {
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();
      this.setState(
        {
          currentQuoteHold: data,
          fadeOut: true,
        },
        () => {
          this.changeColors();
        }
      );
      setTimeout(() => {
        this.setState(
          {
            currentQuote: this.state.currentQuoteHold,
            fadeOut: false,
          },
          () => {
            this.makeTwitterLink();
          }
        );
      }, 1000);
    } catch (err) {
      alert(err);
    }
  };

  makeTwitterLink() {
    const base = "https://twitter.com/intent/tweet?text=";
    const formattedQuote = this.state.currentQuote.content.replaceAll(
      " ",
      "%20"
    );
    this.setState({
      twitterLink:
        base + '"' + formattedQuote + '" ~~ ' + this.state.currentQuote.author,
    });
  }

  changeColors() {
    let colorID = "";
    for (let i = 0; i < 3; i++) {
      let randomNum = Math.floor(Math.random() * 255 + 1);
      colorID += randomNum.toString(16).padStart(2, "0");
    }
    colorID = colorID.toUpperCase();
    this.setState({
      prevHexColor: this.state.hexColor,
      hexColor: "#" + colorID,
      animationKey: this.state.animationKey + 1,
    });
  }

  render() {
    const mainStyle = {
      "--prev-color": this.state.prevHexColor,
      "--new-color": this.state.hexColor,
      backgroundColor: this.state.hexColor,
      color: this.state.hexColor,
      animation: "colorTransition 2s ease-out",
    };

    const buttonStyle = {
      "--prev-color": this.state.prevHexColor,
      "--new-color": this.state.hexColor,
      backgroundColor: this.state.hexColor,
      border: "none",
      color: "white",
      animation: "buttonColorTransition 2s ease-out",
    };

    const quoteStyle = {
      animation: this.state.fadeOut
        ? "vanishText 1s linear"
        : "showText 1s linear",
      opacity: this.state.fadeOut ? 0 : 1,
    };

    return (
      <section
        key={this.state.animationKey}
        className="background"
        style={mainStyle}
      >
        <main>
          <section id="quote-box" className="quoteSection" style={quoteStyle}>
            <RenderQuote quote={this.state.currentQuote} />
            <section className="buttonSection">
              <div className="container">
                <a
                  id="tweet-quote"
                  href={this.state.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="btn btn-default" style={buttonStyle}>
                    <Icon.TwitterX size={20} />
                  </button>
                </a>
              </div>
              <div className="container">
                <button
                  id="new-quote"
                  className="btn btn-default"
                  onClick={this.getRandomQuote}
                  style={buttonStyle}
                >
                  New Quote
                </button>
              </div>
            </section>
          </section>
        </main>
      </section>
    );
  }
}

class RenderQuote extends React.Component {
  render() {
    return (
      <div>
        <blockquote>
          <em id="text">
            <Icon.Quote size={20} />
            {this.props.quote.content}
          </em>
        </blockquote>
        <p id="author" className="author">
          ~~{this.props.quote.author}
        </p>
      </div>
    );
  }
}

export default App;
