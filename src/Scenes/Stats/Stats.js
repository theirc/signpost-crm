import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import api from './api';
//import TaskList from '../tasks/TaskList';
import actions from './actions';
import Select from 'react-select';
import customStyles from './customStyles';
import './Stats.css';

import NewUsers from '../../components/stats/newUsers/NewUsers';
import ContentType from '../../components/stats/contentType/ContentType';

const Stats = () => {

    const [range, setRange] = useState(1);

    const catOptions = [ { value: 1, label: "Current Month"}, { value: 2, label: "Last 3 months"}, { value: 3, label: "All time"}];
    const handleChangeRange = (e) => {

    }
    return (
            <div className="container">
                <h5 className="white-text m-b-40">Stats</h5>
                <div className="row">
                    <div className="filter">
                        <label htmlFor="range" className="m-b-20">Range</label>
                        <Select id="range" styles={customStyles} options={catOptions} onChange={handleChangeRange}/>
                    </div>
                    <NewUsers data={[]}/>
                    <ContentType data={[]}/>
                </div>
            </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(Stats);
