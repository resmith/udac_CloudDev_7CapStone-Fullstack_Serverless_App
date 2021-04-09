import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styles from "./Dashboard.module.css";

import Spaces from "../Spaces/Spaces";
import Pics from "../Pics/Pics";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(`Dashboard props: `, this.props);

    return (
      <div className={`${styles.container} animateFadeIn`}>
        <div className={styles.containerInner}>
          {/* Navigation */}

          {/* Content */}

          <div className={`${styles.contentContainer}`}>
            {this.state.space ? <Pics space={this.state.space} /> : <Spaces />}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
