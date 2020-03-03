import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import './Navbar.css';
import loginActions from '../../Scenes/Login/actions';

const Navbar = (props) => {
    const { user, flex } = props;
    const homeLink = flex ? "/flex" : "/";
    return (
         <nav className="nav-wrapper grey darken-3">
             <div className="container">
                <Link to={homeLink} className="brand-logo crm-logo">Signpost CRM</Link>
                {user && user.name && <ul className="right">
                    {!flex && <li><NavLink to='/session/create'>New chat</NavLink></li>}
                    <li><a onClick={props.logOut}>Log Out</a></li>
                    <li><NavLink to={homeLink} className="btn btn-floating pink lighten-1">{user.initials}</NavLink></li>
                </ul> }
             </div>
         </nav>
    )
}

const mapStateToProps = state => ({
	user: state.login.user
});

const mapDispatchToProps = dispatch => {
	return {
		logOut: () => dispatch(loginActions.setUser(null)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

