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
        followUpCompleted: this.props.s && this.props.s.followUpCompleted,
        messageSid: this.props.s && this.props.s.messageSid,
        text: ''
    }

    componentDidMount(){
        //Check new status
        this.checkStatus();

        // const { messageSid, id } = this.props.s;
        // if (this.props.s.messageSent && this.props.s.messageStatus !== "read"){
        //     let result = await api.checkStatus(messageSid, id);

        //     console.log(result);
        // }
    }

    async checkStatus(){
        const { id } = this.props.s;
        if (this.props.s.messageSent && this.props.s.messageStatus !== "read"){
            let result = await api.checkStatus(this.state.messageSid, id);
            console.log("result status", result);
            this.setState({messageStatus: result});
        }
    }

    handleTextChange = (e) =>{
        this.setState({
            text: e.target.value
        })
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
        console.log("Result",result);
        this.setState({followUp: false, messageSent: true, showSendMessage: false, messageStatus: result && result.status, messageSid: result && result.sid, followUpCompleted: false, messageSid: result.sid});
    }

    async handleSendMessageMessenger(){
        const { phone, id } = this.props.s;
        let result = await api.sendMessageMessenger(phone, id, this.state.text);
        console.log("Result",result);
        this.setState({followUp: false, messageSent: true, showSendMessage: false, messageStatus: result && result.status, messageSid: result && result.sid, followUpCompleted: false, messageSid: result.sid});
    }

    updateState(){
    }

    getIcon(status){
        switch(status){
            case "queued":
                return "access_time";
            case "sent":
                return "done";
            case "delivered":
                return "done";
            case "received":
                return "done_all";
            case "read":
                return "visibility";
            default:
                return "access_time";
        }
    }
    getCategories(categories){
        let list = categories.map(c => {return c.name });
        return list.join(", ");
    }

    render(){
        const s = this.props.s;
        const isMessenger = s.phone.match(/\d{16}/) ? true : false;
        const { followUp, messageSent, followUpCompleted } = this.state;
        const { showFollowUpActions } = this.props;
        const categories = this.getCategories(this.props.s.categories)
        const showFollowUpFooter = followUp || s.followUpCompleted;
        return (
            <div key={s.id} className="sessionElement">
                {this.state.showSendMessage && <div className="overlay" onClick={this.handleHideSendMessage.bind(this)}></div>}
                <div className="row">
                    <div className="pull-left"><span className="phoneNumber">{s.phone}</span> - <span className="date">{moment(s.createdAt).format('lll')}</span></div>
                    <div className="pull-right categories">{categories}</div>
                </div>
                <div className="notes">
                    <div>{s.notes}</div>
                </div>
                {showFollowUpFooter &&
                <div className="footer">
                    {!s.followUpCompleted && <div className="followUp">Requires follow-up</div>}
                    {s.followUpCompleted && <div className="followUpCompleted">Follow-up completed</div>}
                {!this.state.showSendMessage && showFollowUpActions && !s.followUpCompleted && <a className="waves-effect waves-light btn blue darken-3 btn-message" onClick={this.handleShowSendMessage.bind(this)}>Send message<i className="material-icons right">send</i></a>}
                </div>
                }
                {!followUp && messageSent && !followUpCompleted &&
                    <div className="message-status"><div className="messageSent">Message sent</div><i className="material-icons message-status-icon tooltiped" >{this.getIcon(this.state.messageStatus)}</i><div className="tooltip">{this.state.messageStatus}</div>
                    </div>
                }
                {this.state.showSendMessage && !isMessenger &&
                <div className="hoverable">
                    <h6><strong>Send the following message and remove the "Requires follow-up" mark</strong></h6>
                    <h6>`Hello! We have new information regarding your inquiry. Please reply to this message to chat with an assistant.`</h6>
                    <div className="message-footer">
                    <a className="waves-effect waves-light btn blue darken-3 btn-message" onClick={this.handleSendMessage.bind(this)}>Send <i className="material-icons right">send</i></a>
                    <a className="waves-effect waves-light btn b deep-orange accent-4 btn-message" onClick={this.handleHideSendMessage.bind(this)}>Cancel<i className="material-icons right">cancel</i></a>
                    </div>
                </div>
                }
                {this.state.showSendMessage && isMessenger &&
                <div className="hoverable">
                    <h6><strong>Send your message to resume contact. The "Requires follow-up" mark will be removed.</strong></h6>
                    <input className="followup-message" onChange={this.handleTextChange} autoFocus id="follow-up-pmessage"></input>
                    <div className="message-footer">
                    <a className="waves-effect waves-light btn blue darken-3 btn-message" onClick={this.handleSendMessageMessenger.bind(this)}>Send <i className="material-icons right">send</i></a>
                    <a className="waves-effect waves-light btn b deep-orange accent-4 btn-message" onClick={this.handleHideSendMessage.bind(this)}>Cancel<i className="material-icons right">cancel</i></a>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default UserSessions;