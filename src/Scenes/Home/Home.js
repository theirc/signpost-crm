import React from 'react';
import { Redirect } from 'react-router-dom';
import  Sessions from '../Sessions/Sessions';
import Navbar from '../../components/layouts/Navbar';

const Home = props => {
    
    const { auth, phone, flex } = props;
    if (auth && !auth.uid) return <Redirect to="/login"/>
    // if ( phone ) return <Redirect to="/session/create/"/>

    return(
        <div>
            <Navbar flex={flex}/>
            <div className="container">
                <Sessions/>
            </div>
        </div>
    )
}

export default(Home);