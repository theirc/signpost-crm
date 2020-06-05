import React from 'react';
import Message from './Message';
import './Message.css';

const HistoryList = ({history, phone}) => {
    const isMessenger = phone.match(/\d{16}/) ? true : false;
    const windowClass = isMessenger ? "history-list-window-messenger" : "history-list-window";
    return (
        <div className="history-list content section">
            <h5>Historial</h5>
            <div className={windowClass}>
                {history && history.map((message,index) => {
                    return (
                        <Message message={message} phone={phone} key={index}/>
                    )
                })}
                </div>
        </div>
    )
}
export default HistoryList;