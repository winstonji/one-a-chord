import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../programWindow';
import { Chart } from '../../model/chart';
import ChartMetaDataComponent from '../chartComponents/chartMetaDataComponent';
const SingleColumn = () => {

    const chart:Chart = useContext(ChartContext);
    

	return (<>
        <ChartMetaDataComponent {...chart.metaData}/>
    </>);
}

export default SingleColumn;
