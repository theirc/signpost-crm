import React, { Component } from 'react'
import api from './api';
import actions from './actions';
import moment from 'moment';
import UserSessions from './UserSessions';
import { Redirect } from 'react-router-dom';

class Sessions extends Component{
    constructor( props ){
        super(props);
    }
    
    state = {
        sessions : [],
        loading: false,
        showSendMessage: false,
        redirect :false
    }

    componentDidMount(){
        this.getSessionList();
    }
    getSessionList(){
        api.getSessions().then(list => {
            if (list == null){
                this.setState({redirect: true, sessions:[]})
            }else{
                this.setState( {sessions: list.rows})
            }
        })
    }

    render(){
        const { sessions } = this.state;
        if (this.state.redirect) return <Redirect to="/login"/>

        return (
            <div>
            <h3>Sesiones de Chat</h3>
            {sessions && sessions.length>0 &&
                sessions.map(s => 
                        <UserSessions showFollowUpActions={true} reload={this.getSessionList.bind(this)} key={s.id} s={s}/>
                    )}
            
            </div>
        )
    }
}

export default Sessions;