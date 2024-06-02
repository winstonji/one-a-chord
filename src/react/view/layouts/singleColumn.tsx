import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../programWindow';
import { Chart } from '../../model/chart';
import ChartMetaDataComponent from '../chartComponents/chartMetaDataComponent';
import { ChartMetaData } from '../../model/chartMetaData';
const SingleColumn = () => {

    const chart:Chart = useContext(ChartContext);
    const metadata: ChartMetaData = chart.metaData;

	return (<>
        <ChartMetaDataComponent {...metadata}/>
    </>);
}

export default SingleColumn;
