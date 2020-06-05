import React from 'react';
import moment from 'moment';
import './Message.css';

const Message = ({message, phone}) => {
    const isMessenger = phone.match(/\d{16}/) ? true : false;
    const backColor = isMessenger ? "message-blue" : "message-green";
    const classname = message.from.indexOf(phone) > -1 ? "left light-3 black-text" : `right ${backColor} light-3`;
    const date = new Date(message.date);
    const text = message.body.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return (
        <div className={"card rounded z-depth-1 message-detail "+classname}>
            <div className={`card-content`}>
                <span className="card-body line-break">{message.body}</span>
                <div className="message-date">{moment(date).format('lll')}</div>
            </div>
        </div>
    )
}
export default Message;