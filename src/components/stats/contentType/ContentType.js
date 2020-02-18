import React, { userState, useEffect} from 'react';
import { Chart } from "react-google-charts";
import './ContentType.css';

const ContentType = (d) => {

    const data = { informativos: 72, services: 28, moderator: 13  };

    return (
        <div className="content-type chart">
            <label>Content Types chosen in the Flow</label>
            <div className="bar-chart">
                <div class="chart-label">Informativos</div><div className="informativos" style={{width:`${data.informativos}%`}}>{data.informativos} %</div>
                <div class="chart-label">Link for Services</div><div className="services" style={{width:`${data.services}%`}}>{100-data.services} %</div>
                <div class="chart-label">Talk to a moderator</div><div className="moderator" style={{width:`${data.moderator}%`}}>{100-data.moderator} %</div>
            </div>
        </div>
    )
}

export default ContentType;