import { useState } from 'react';
import BarChart from './BarChart';
import AreaChart from './AreaChart';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/ChartsContainer';


const ChartsContainer = () => {

    // const { monthlyApplications: data } = useAppContext();
    // const [wunderBar, setWunderBar] = useState(true)

    return (
        <Wrapper>
            <h4>Monthly Applications</h4>
            {/* 
            <button type='button' onClick={() => setWunderBar(!wunderBar)}>
                {wunderBar ? 'AreaChart' : 'WunderBar'}
            </button>
            {wunderBar ? <BarChart data={data} /> : <AreaChart data={data} />} */}
        </Wrapper>
    );
}

export default ChartsContainer