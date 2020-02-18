import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../shared/store';
import Navbar from '../components/layouts/Navbar';
import Home from '../Scenes/Home/Home';
import Login from '../Scenes/Login/Login';
import CreateSession from '../Scenes/Sessions/CreateSession';
import Stats from '../Scenes/Stats/Stats';

const AppRouter = props => {
    // { phone } = props.match.params;
    console.info("Match:", props);
    return (
        <ConnectedRouter history={history}>
            {props.user && 
                <div className="AppRouter">
                    <Switch>
                        <Route exact path="/flex"  render={(props) => <Home {...props} flex={true}/>}/>  
                        <Route exact path="/" component={Home} />
                        <Route exact path="/flex/phone/:phone" render={(props) => <CreateSession {...props} flex={true}/>}/>
                        <Route exact path="/phone/:phone" component={CreateSession} />
                        <Route path="/login" component={Login}/>
                        <Route path="/session/create" component={CreateSession}/>
                        <Route path="/stats" component={Stats}/>
                    </Switch>
                </div>
            }
            {!props.user &&
                <div className="AppRouter">
                    <Navbar user={props.user}/>
                    <Redirect to="/"/>
                    <Route path="/" component={props => <Login {...props}/>}/>
                </div>
            }
        </ConnectedRouter>
    )
}

const mapStateToProps = state => ({
	path: state.router.location.pathname,
	user: state.login.user,
});

export default connect(mapStateToProps)(AppRouter);
