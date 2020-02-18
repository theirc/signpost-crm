import React, { useEffect, useState }  from 'react';
import { Prompt } from 'react-router';
import Task from './Task';
import './Task.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import api from './api';

const TaskList = ({phone, updateTaskCount}) => {

    const [showList, setShowList] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({});
    const [saveDisabled, setSaveDisabled] = useState('');
    const [tasks, setTaskList] = useState([]);

    const handleNewTask = () =>{
        setShowList(false);
    }

    useEffect(() => {
        setData({ dueDate: new Date(), phone: phone });
        loadTasks();
    }, [phone]);

    const handleSubmit = (e) => {
        e.preventDefault();
        api.saveTask(data)
        .then(res => {
            if (res.status == 200){
                setShowList(true);
                loadTasks();
            }
        });
        return true;
    }

    const loadTasks = () => {
        api.getTasks(phone).then(list =>{
            setTaskList(list.rows);
            updateTaskCount(list.count);
        }
        )
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setShowList(true);
    }

    const handleChange = (e) => {
        e.persist();
        if (e.target) setData(data => ({ ...data, [e.target.name]: e.target.value}));
    }
    const handleChangeDate = (date) => {
        setData(data => ({...data, dueDate: date}));
    }

    return (
        <div className="task-list content section">
            <h3>Tasks</h3>
            <div className="input-field">
                <button className="btn blue lighten-1 z-depth-0" onClick={handleNewTask}>New Task</button>
            </div>  
                {showList && tasks && tasks.length >0 &&
                    <table>
                    <tbody>
                    <tr>
                        <td>DATE</td>
                        <td>SUMMARY</td>
                        <td>RESOLVED</td>
                    </tr>
                    {tasks.map((task, index) => {
                        return <tr key={index}>
                            <td>{moment(task.createdAt).calendar()}</td>
                            <td>{task.summary}</td>
                            <td>{task.isResolved ? 'Yes': 'No'}</td>
                        </tr>})}
                    </tbody>
                </table>
                }
                
                {!showList && 
                    <React.Fragment>
                        <Prompt when={!showList} message="You have unsaved changes, are you sure you want to leave?"/>
                    
                    <div className="card task-form">
                        <div className="card-header">
                            <h5>Create New Follow Up Task for # {phone} </h5>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="input-field">
                                    <label htmlFor="summary">Summary</label>
                                    <input type="text" id="summary" name="summary" onChange={handleChange}/>                        
                                </div>
                                <div className="input-field">
                                    <label htmlFor="description">Description</label>
                                    <textarea rows="3" id="description" name="description" className="materialize-textarea " onChange={handleChange}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="due-date" className="m-r-20">Due Date:</label>
                                    <DatePicker selected={data.dueDate} onChange={handleChangeDate} minDate={moment().toDate()}/>
                               </div>
                            </div>
                            <div className="card-footer">
                                <div className="input-field">
                                    <button className="btn grey lighten-1 z-depth-0" onClick={handleCancel} disabled={saveDisabled}>Cancel</button>
                                </div>
                                <div className="input-field">
                                    <button className="btn pink lighten-1 z-depth-0" onClick={handleSubmit} disabled={saveDisabled}>Save</button>
                                </div>
                                
                                {isSaving && 
                                <p>Saving task...</p> }
                            </div>

                            
                        </form>
                    
                    </div>
                    </React.Fragment>  
                    }  
                               
        </div>
    )
}
export default TaskList;