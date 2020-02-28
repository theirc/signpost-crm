import React, { Component } from 'react'
import api from './api';
import actions from './actions';
import moment from 'moment';
import UserSessions from './UserSessions';

class Sessions extends Component{
    constructor( props ){
        super(props);
    }
    
    state = {
        sessions : [],
        loading: false,
        showSendMessage: false
    }

    componentDidMount(){
        this.getSessionList()
    }
    getSessionList(){
        console.log("Load list");
        api.getSessions().then(list => {
            console.log("list loaded");
            this.setState( {sessions: list.rows})
        })
    }

    render(){
        const { sessions } = this.state;
        return (
            <div>
            <h3>Chat Sessions</h3>
            {sessions && sessions.length>0 &&
                sessions.map(s => 
                        <UserSessions reload={this.getSessionList.bind(this)} key={s.id} s={s}/>
                    )}
            
            </div>
        )
    }
}

export default Sessions;