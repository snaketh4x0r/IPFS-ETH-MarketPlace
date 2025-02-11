import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { web3Actions, boxActions } from "../../actions";
import { history } from "../../helpers";
import loading from "../../assets/img/loading.gif";
import "../../assets/scss/navBar.scss";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: this.props.location.pathname
        };
        this.connect = this.connect.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.location.pathname !== state.pathname) {
            return {
                pathname: props.location.pathname
            };
        }
        return null;
    }

    async connect() {
        await this.props.loadWeb3();
		history.push("/sell");
		//3box commented for faster loading for now
        // await this.props.loadbox(this.props.account);

    }

    render() {
        const { inProgress, account, connected } = this.props;
        return (
            <div className="navBarContainer">
                <img
                    className="loading"
                    src={loading}
                    style={inProgress ? { opacity: 1 } : { opacity: 0 }}
                />	
                <div className="navBarLogo">ShopFS</div>				
                <div className="navBarAddress">
                    {connected ? (
                        "Logged in as " + account
                    ) : (
                        <div
                            className="btn-hover"
                            onClick={() => {
                                this.connect();
                            }}
                        >
                            Join now
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
function mapState(state) {
    const { account, connected } = state.web3;
    //const { loggedIn } = state.box;
    const inProgress =
        state.user.inProgress ||
        //state.box.inProgress ||
        state.web3.inProgress;
    return { inProgress, account, connected };
}

const actionCreators = {
    loadWeb3: web3Actions.loadWeb3,
    loadbox: boxActions.loadbox
};

const connectedNavBar = withRouter(connect(mapState, actionCreators)(NavBar));
export { connectedNavBar as NavBar };
