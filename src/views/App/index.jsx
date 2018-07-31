import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

import Header from "./../../components/Header";
import NOSActions from "./../../components/NOSActions";
import Directory from "./../../components/Directory";


const styles = {
  "@import": "https://fonts.googleapis.com/css?family=Source+Sans+Pro",
  "@global html, body": {
    fontFamily: "Source Sans Pro",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff"
  },
  App: {
    textAlign: "center"
  },
  intro: {
    fontSize: "large"
  },
  lineBreak: {
    width: "75%",
    borderTop: "1px solid #333333",
    margin: "32px auto"
  }
};

const App = ({ classes }) => (
  <div className={classes.App}>
    <Header title="AskDEV" />
    <p className={classes.intro}>
    AskDEV is a directory of nOS devs who would like to anwser your questions
    </p>
    <p className={classes.intro}>Pay a small fee in GAS for questions</p>
    <hr className={classes.lineBreak} />
    <Directory />
  </div>
);

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default injectSheet(styles)(App);
