import React, { Component } from 'react'
import { connect } from 'react-redux';
import { saveSession } from './actions';
import { Redirect } from 'react-router-dom';
import HistoryList from '../../components/history/HistoryList';
import api from './api';
import TaskList from '../../components/tasks/TasksList';
import UserSessions from './UserSessions';
import Select from 'react-select';
import actions from './actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Navbar from '../../components/layouts/Navbar';

import './Sessions.css';
import customStyles from './customStyles';
import Sessions from './Sessions';

class CreateSession extends Component {
    state = {
        phone : this.props.match.params.phone ? this.props.match.params.phone : '',
        notes: '',
        category: '',
        followup: '',
        history: [],
        loadingHistory: false,
        userSessions: [],
    }

    componentDidMount(){
        console.log("did mount", this.props.match);
        if (this.props.match && this.props.match.params.phone){
            console.log("Phone", this.props.match.params.phone);
            api.getSessions(this.props.match.params.phone).then(list => {
                console.log(list);
                this.setState({userSessions: list.rows})
            });
            fetch(`https://mustard-himalayan-7945.twil.io/get_logs?phone=${this.props.match.params.phone}`)
            .then((response) => {
                return response.json()
            })
            .then((history) => {
                this.setState({history: history.result, loadingHistory: false});
                
            })
        }
    }
    handleChange = (e) =>{
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleChangeCategory = (e) => 
        this.setState({
            category: e.value
        })

    handleSubmit = (e) => {
        e.preventDefault();
        api.saveSession(this.state);
        const {flex } = this.props;

        this.props.history.push(flex ? "/flex" : "/");
    }
    updateTaskCount = (count) => {
        this.setState({taskCount : count});
    }
    // handleSearch = (e) =>{
    //     ///To do: move this action to API
    //     e.preventDefault();
    //     this.setState({loadingHistory : true});
    //     let phone = this.props.match && this.props.match.phone ? this.props.match.phone : this.state.phone;
    //     let headers = [
    //         ['Content-Type', 'application/x-www-form-urlencoded'],
    //         ['Content-Type', 'multipart/form-data'],
    //         ['Content-Type', 'text/plain'],
    //       ];
    //     if (phone){
    //         fetch(`https://mustard-himalayan-7945.twil.io/get_logs?phone=${phone}`)
    //         .then((response) => {
    //             return response.json()
    //         })
    //         .then((history) => {
    //             this.setState({history: history.result, loadingHistory: false});
                
    //         })
    //     }
    //     console.log("ges sessions");
    //     api.getSessions(this.state.phone).then(list => {
    //         console.log(list);
    //         this.setState({userSessions: list.rows})
    //     });
    // }

    render() {
        
        const { user, flex } = this.props;
        const { phone, loadingHistory, history, category, userSessions, tasks, taskCount } = this.state;
        const showTaskCount = taskCount && taskCount > 0 ? `(${taskCount})` : '';
        const categories = [{Category:"Health", value: 1}, {Category: "Women", value: 3}, {Category:"Violence", value: 2 }];
        const saveDisabled = phone && category ? "": "disabled";
        const catOptions = categories && categories.map(c => {return {value: c.value, label: c.Category}});

        if (user && !user.id) return <Redirect to="/signin"/>
        return (
            <div className="createSession">
            {!flex &&  <Navbar user={user}/>}
            
            <div className="container container-flex">
            <h5 className="m-b-40">Create new Chat Session</h5>
                <div className="row">
                    <div className="col s6">
                        <form onSubmit={this.handleSubmit} className="chat-form">
                            
                            <div className="input-field">
                                <label htmlFor="phone">Phone Number</label>
                                <input type="number" id="phone" value={phone} onChange={this.handleChange}/>                        
                            </div>
                            <div className="input-field">
                                <label htmlFor="notes">Notes</label>
                                <textarea rows="3" id="notes" className="materialize-textarea " onChange={this.handleChange}></textarea>
                            </div>
                            
                            <div className="input m-t-20">
                                <label htmlFor="category" className="m-b-20">Category</label>
                                <Select id="category" styles={customStyles} options={catOptions} onChange={this.handleChangeCategory}/>
                            </div>
                            <label className="m-t-20">
                                <input type="checkbox" id="followup" onChange={this.handleChange} />
                                <span>Needs Follow Up</span>
                            </label>
                            <div className="row m-t-20">
                                
                                <div className="col s12">
                                    {phone && !loadingHistory && !flex && 
                                    
                                    <div className="input-field pull-left">
                                        <button className="btn blue lighten-1 z-depth-0" onClick={this.handleSearch}>Search History</button>
                                    </div>
                                    }
                                    <div className="input-field pull-right">
                                        <button className="btn blue z-depth-0" disabled={saveDisabled}>Save</button>
                                    </div>
                                </div>
                            </div>
                            
                            {loadingHistory && 
                            <p>Loading history...</p> }
                        </form>
                        {history && history.length > 0 &&
                            <div className="row">
                            <div className="col s12"> 
                                <HistoryList history={history} phone={phone}/>
                            </div>
                            </div>
                        }
                    </div>
                    <div className="col s6">
                        <h5>Activity</h5>
                        <UserSessions sessions={userSessions}/>
                    </div>
                </div>
                
                {/* {phone && 
                <div className="row m-t-50">
                    <Tabs forceRenderTabPanel={true}>
                        <TabList>
                            <Tab>Sessions</Tab>
                            <Tab>History</Tab>
                        </TabList>
                        <TabPanel>
                            {phone && userSessions && userSessions.length > 0 && 
                                <div className="col s12"> 
                                    {<UserSessions sessions={userSessions}/>}
                                </div> 
                            }
                        </TabPanel>
                        <TabPanel>
                            {history && history.length > 0 &&
                                <div className="col s12"> 
                                    <HistoryList history={history} phone={phone}/>
                                </div>}
                        </TabPanel>
                    </Tabs>
                </div>
                } */}
            </div>
        </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.login.user,
        token: state.login.token
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveSession: (chat) => dispatch(actions.saveSession(chat))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSession);
