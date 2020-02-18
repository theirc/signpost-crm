import React, { Component } from 'react'
import { connect } from 'react-redux';
import actions from './actions';
import moment from 'moment';

class UserSessions extends Component{

render(){
    const { sessions } = this.props;
    return (
        <div>
        {sessions && sessions.length>0 &&
                sessions.map(s => 
                    
                    <div key={s.id} className="sessionElement">
                        <div className="row">
                            <div className="pull-left date">{moment(s.createdAt).format('lll')}</div>
                            <div className="pull-right">{s.category.name}</div>
                        </div>
                        <div className="notes">
                            <div>{s.notes}</div>
                        </div>
                        
                        
                    </div>
                )

        }
        </div>
    )
}
}

export default UserSessions;