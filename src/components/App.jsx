import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { history } from "../helpers";
import { web3Actions } from "../actions";
import { ErrorBoundary, NavBar } from "../components/common";
import loading from "../assets/img/loading.gif";
import "../assets/scss/app.scss";
const HomePage = React.lazy(() => import("./pages/HomePage"));
const SellPage = React.lazy(() => import("./pages/SellPage"));
const ThreadPage = React.lazy(() => import("./pages/ThreadPage"));
const DetailsPage = React.lazy(() => import("./pages/DetailsPage"));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.accountChanged = this.accountChanged.bind(this);
        this.networkChanged = this.networkChanged.bind(this);
    }

    async accountChanged() {
        if (this.props.web3) {
            await this.props.loadAccount();
        }
    }
    async networkChanged() {
        if (this.props.web3) {
            await this.props.loadNetwork();
        }
    }

    componentDidMount() {
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = false;
            window.ethereum.on("accountsChanged", this.accountChanged);
            window.ethereum.on("networkChanged", this.networkChanged);
        }
    }

    render() {
        return (
            <div className="app">
                <ToastContainer autoClose={4000} />
                <Router history={history}>
                    <ErrorBoundary key={location.pathname}>
                        <React.Suspense
                            fallback={
                                <div className="suspense">
                                    <img className="loading" src={loading} />
                                </div>
                            }
                        >
                        
                                <Switch>
                                    <Route
                                        exact
                                        path="/"
                                        component={HomePage}
                                    />	
                                    <Route
                                        exact
                                        path="/sell"
                                        component={SellPage}
                                    />
									<Route
                                        exact
                                        path="/details/:fileId"
                                        component={DetailsPage}
                                    />
                                    /*<Route
                                        exact
                                        path="/thread"
                                        component={ThreadPage}
                                    />
								*/
                                    <Redirect from="*" to="/" />
                                </Switch>
						
                        </React.Suspense>
                        <NavBar />
                    </ErrorBoundary>
                </Router>
            </div>
        );
    }
}

function mapState(state) {
    const { web3, connected } = state.web3;
    return { web3, connected };
}

const actionCreators = {
    loadAccount: web3Actions.loadAccount,
    loadNetwork: web3Actions.loadNetwork
};

const connectedApp = connect(mapState, actionCreators)(App);
export default connectedApp;
