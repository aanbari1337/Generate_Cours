import React, { Component } from "react";
import { connect } from "react-redux";
import Onglet from "./Onglets/Onglet";
import { CreateCours } from "../../store/actions/coursAction";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

class Createcours extends Component {
  state = {
    nomCours: "",
    nbrOnglet: "",
    buttonClicked: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ buttonClicked: true });
    this.props.CreateCours(this.state, this.props.cours);
  };

  showOnglets = (nbrOnglet) => {
    let onglets = [];
    for (let i = 1; i <= nbrOnglet; i++) {
      onglets.push(<Onglet key={i} nomCours={this.state.nomCours} id={i} />);
    }
    return onglets;
  };

  render() {
    if (!this.props.auth.uid) return <Redirect to="/signin" />;
    const { coursExist } = this.props;
    return (
      <div className="container">
        <div className="card border-secondary mb-3">
          <h5 className="card-header">Créer un nouveau cours</h5>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="nomCours">Nom du cours</label>
                <input
                  type="text"
                  className="form-control"
                  id="nomCours"
                  placeholder="intitulé du cours"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nbrOnglet">Nombre d'onglet</label>
                <input
                  type="text"
                  className="form-control"
                  id="nbrOnglet"
                  placeholder="nombre d'onglet"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Créer
              </button>
            </form>
            <div className="text-center text-danger">
              {this.state.buttonClicked && coursExist ? (
                <p>{coursExist}</p>
              ) : null}
            </div>
          </div>
        </div>
        {this.state.buttonClicked && coursExist === null
          ? this.showOnglets(this.state.nbrOnglet)
          : null}
      </div>
    );
  }
}

const mapPropsToState = (state) => {
  console.log(state);
  return {
    auth: state.firebase.auth,
    cours: state.firestore.ordered.cours,
    coursExist: state.cours.exist,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    CreateCours: (cours, listCours) => dispatch(CreateCours(cours, listCours)),
  };
};

export default compose(
  firestoreConnect([{ collection: "cours" }]),
  connect(mapPropsToState, mapDispatchToProps)
)(Createcours);
