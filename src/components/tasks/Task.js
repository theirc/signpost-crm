import React from 'react';
import moment from 'moment';
import './Task.css';

const Task = ({phone, task, index}) => {
    const date = new Date(task.date);
    const text = task.details.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return (
        <div className={"card rounded z-depth-1 message-detail "} index={index}>
            <div className="card-content grey-text text-darken-3">
                <span className="card-body line-break">{task.details}</span>
                <div className="task-date">{moment(date).format('lll')}</div>
            </div>
        </div>
    )
}
export default Task;