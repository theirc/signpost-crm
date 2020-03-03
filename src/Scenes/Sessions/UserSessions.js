import React, { Component } from 'react'
import { connect } from 'react-redux';
import actions from './actions';
import moment from 'moment';
import api from './api';

class UserSessions extends Component{
    state = {
        showSendMessage: false,
        followUp: this.props.s && this.props.s.followUp,
        messageSent: this.props.s && this.props.s.messageSent,
        messageStatus: this.props.s && this.props.s.messageStatus,
    }

    componentDidMount(){
        //Check new status 
        const { messageSid, id } = this.props.s;
        if (this.props.s.messageSent && this.props.s.messageStatus !== "read"){
            let result = (async function getStatus() {
                await api.checkStatus(messageSid, id)
            })();
        }
    }

    handleShowSendMessage(){
        this.setState({showSendMessage: true});
    }
    handleHideSendMessage(){
        this.setState({showSendMessage: false});
    }
    async handleSendMessage(){
        const { phone, id } = this.props.s; 
        let result = await api.sendMessage(phone, id);
        this.setState({followUp: false, messageSent: true, showSendMessage: false, messageStatus: result && result.status, messageSid: result && result.sid});
    }
    updateState(){
    }

    getIcon(status){
        switch(status){
            case "queued":
                return "access_time";
            case "sent":
                return "done";
            case "received":
                return "done_all";
            case "read":
                return "visibility";
            default:
                return "access_time";
        }
    }

    render(){
        const s = this.props.s;
        const { followUp } = this.state;
        const { showFollowUpActions } = this.props;
        console.log("showFolloUpActions",showFollowUpActions);
        return (
            <div key={s.id} className="sessionElement">
                {this.state.showSendMessage && <div className="overlay" onClick={this.handleHideSendMessage.bind(this)}></div>}
                <div className="row">
                    <div className="pull-left"><span className="phoneNumber">{s.phone}</span> - <span className="date">{moment(s.createdAt).format('lll')}</span></div>
                    <div className="pull-right">{s.category && s.category.name}</div>
                </div>
                <div className="notes">
                    <div>{s.notes}</div>
                </div>
                {followUp && 
                <div className="footer">
                <div className="followUp">FOLLOW UP</div>
                {!this.state.showSendMessage && showFollowUpActions && <a className="waves-effect waves-light btn blue darken-3 btn-message" onClick={this.handleShowSendMessage.bind(this)}>Send message<i className="material-icons right">send</i></a>}
                </div>
                }
                {!followUp && s.messageSent && 
                    <div className="message-status"><div className="messageSent">MESSAGE SENT</div><i className="material-icons message-status-icon tooltiped" >{this.getIcon(s.messageStatus)}</i><div className="tooltip">{s.messageStatus}</div>
                    </div>
                }
                {this.state.showSendMessage &&
                <div className="hoverable">
                    <h6><strong>Send the following message and remove 'Follow Up' flag</strong></h6>
                    <h6>¡Hola! tenemos información relacionada a su consulta sobre <strong>{s.category.name}</strong>. Por favor responda este mensaje para chatear con un asistente</h6>
                    <div className="message-footer">
                    <a className="waves-effect waves-light btn blue darken-3 btn-message" onClick={this.handleSendMessage.bind(this)}>Send <i className="material-icons right">send</i></a>
                    <a className="waves-effect waves-light btn b deep-orange accent-4 btn-message" onClick={this.handleHideSendMessage.bind(this)}>Cancel<i className="material-icons right">cancel</i></a>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default UserSessions;