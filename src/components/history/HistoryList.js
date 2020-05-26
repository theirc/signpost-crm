import React from 'react';
import Message from './Message';
import './Message.css';

const HistoryList = ({history, phone}) => {
    return (
        <div className="history-list content section">
            <h5>Historial</h5>
            <div className="history-list-window">
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