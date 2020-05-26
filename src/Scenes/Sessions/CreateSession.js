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
import { TaskChannelInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/taskChannel';

class CreateSession extends Component {
    
    state = {
        phone : this.props.match.params.phone ? this.props.match.params.phone : '',
        notes: '',
        followUp: 0,
        history: [],
        loadingHistory: false,
        userSessions: [],
        categories: null,
        categoryList: [],
        redirect: false,
    }

    componentDidMount(){
        this.getCategoryList();
        if (this.props.match && this.props.match.params.phone){
            this.searchSessions(this.props.match.params.phone);
        }
    }
    handleChange = (e) =>{
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleChangeCategory = (e) => {
        this.setState({
            categories: e
        })
    }

    handleChangeFollowUp = (e) => {
        this.setState({
            followUp: e.target.checked
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const session = this.state;
        session.userSessions = null;
        session.history = null;
        const { flex } = this.props;
        api.saveSession(session).then(result => this.props.history.push(flex ? "/flex" : "/"));
        
    }
    updateTaskCount = (count) => {
        this.setState({taskCount : count});
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.searchSessions(this.state.phone);
    }

    searchSessions = (phone) => {
        api.getSessions(phone).then(list => {
            if (list == null){
                this.setState({redirect: true, userSessions: []});
            }else{
                this.setState({userSessions: list.rows})
            }
            
        });
        fetch(`https://mustard-himalayan-7945.twil.io/get_logs?phone=${phone}`)
        .then((response) => {
            return response.json()
        })
        .then((history) => {
            this.setState({history: history.result, loadingHistory: false});
            
        })
    }

    getCategoryList = () => {
        api.getCategories().then(list => {
            if (list == null){
                this.setState({ redirect: true, categoryList: []});
            } else{
                this.setState({categoryList : list.rows});
            }
            
        })
    }

    render() {
        
        const { user, flex } = this.props;
        const { phone, loadingHistory, history, categories, userSessions, tasks, taskCount, categoryList } = this.state;
        const saveDisabled = phone && categories && categories.length > 0 ? "": "disabled";
        const catOptions = categoryList && categoryList.map(c => {return {value: c.id, label: c.name}});
        const showSessions = userSessions != null && userSessions.length > 0 ? true : false;
        if ((user && !user.id) || this.state.redirect) return <Redirect to="/login"/>
        return (
            <div className="createSession">
            {!flex &&  <Navbar user={user}/>}
            
            <div className="container container-flex">
            <h5 className="m-b-40">Crear Nueva sesión de Chat</h5>
                <div className="row">
                    <div className="col s6">
                        <form onSubmit={this.handleSubmit} className="chat-form">
                            
                            <div className="input-field">
                                <label htmlFor="phone">Número de teléfono</label>
                                <input type="number" id="phone" value={phone} onChange={this.handleChange}/>                        
                            </div>
                            <div className="input-field">
                                <label htmlFor="notes">Notas</label>
                                <textarea rows="3" id="notes" className="materialize-textarea " onChange={this.handleChange}></textarea>
                            </div>
                            
                            <div className="input m-t-20">
                                <label htmlFor="category" className="m-b-20">Categorías</label>
                                <Select id="category" isMulti={true} values={categories} styles={customStyles} options={catOptions} onChange={this.handleChangeCategory}/>
                            </div>
                            <label className="m-t-20">
                                <input type="checkbox" id="followup" onClick={this.handleChangeFollowUp} />
                                <span>Requiere Seguimiento</span>
                            </label>
                            <div className="row m-t-20">
                                
                                <div className="col s12">
                                    {phone && !loadingHistory && !flex && 
                                    
                                    <div className="input-field pull-left">
                                        <button className="btn blue lighten-1 z-depth-0" onClick={this.handleSearch}>Buscar Historial</button>
                                    </div>
                                    }
                                    <div className="input-field pull-right">
                                        <button className="btn blue z-depth-0" disabled={saveDisabled}>Grabar</button>
                                    </div>
                                </div>
                            </div>
                            
                            {loadingHistory && 
                            <p>Cargando historial...</p> }
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
                        <h5>Actividad</h5>
                        {showSessions && userSessions && userSessions.length>0 &&
                                userSessions.map(s => 
                                     <UserSessions showFollowUpActions={false} key={s.id} s={s}/>
                        )}
                    </div>
                </div>
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
