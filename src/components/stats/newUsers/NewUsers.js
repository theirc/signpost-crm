import React, { userState, useEffect} from 'react';
import { Chart } from "react-google-charts";
import './newUsers.css';

const NewUsers = (d) => {

    const data = { New: 34 };

    return (
        <div className="chart">
            <label>New/Returning Users</label>
            <div className="bar-chart">
                <div className="new-users" style={{width:`${data.New}%`}}>{data.New} %</div>
                <div className="returning-users" style={{width:`${100-data.New}%`}}>{100-data.New} %</div>
            </div>
        </div>
    )
}

export default NewUsers;