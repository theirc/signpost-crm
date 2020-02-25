import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import HistoryList from '../../components/history/HistoryList';
import api from './api';
import actions from './actions';
import moment from 'moment';

class Sessions extends Component{
    state = {
        sessions : [],
        loading: false,
    }

    componentDidMount(){
        let sessions = api.getSessions().then(list => {
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
                        <div key={s.id} className="sessionElement">
                        <div className="row">
                            <div className="pull-left"><span className="phoneNumber">{s.phone}</span> - <span className="date">{moment(s.createdAt).format('lll')}</span></div>
                            <div className="pull-right">{s.category.name}</div>
                        </div>
                        <div className="notes">
                            <div>{s.notes}</div>
                        </div>
                        {s.followup && 
                        <div className="followup">FOLLOW UP</div>}
                        
                        
                    </div>)}
            
            </div>
        )
    }
}

export default Sessions;