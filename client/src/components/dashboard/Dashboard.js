import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    // Make sure that profile state != null before rendering
    // Get user from auth state and profile & loading from prof state (checking 'profile' from initialState in profileReducer.js)
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) {
      // dashboardContent = <h4>Loading...</h4>;
      dashboardContent = <Spinner />;
    } else {
      // Check if user has made a profile yet
      if (Object.keys(profile).length > 0) {
        // Logged in user HAS a profile
        dashboardContent = <h4> Display profile here </h4>;
      } else {
        // Logged in user does not have a profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome, {user.name}</p>
            <p>Please click the following link to set up your profile.</p>
            <Link to="/create/profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.PropTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
