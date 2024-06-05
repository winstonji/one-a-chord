import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../programWindow';
import { Chart } from '../../model/chart';
import ChartMetaDataComponent from '../chartComponents/chartMetaDataComponent';
import { ChartMetaData } from '../../model/chartMetaData';
import { Block } from '../../model/block';
import BlockComponent from '../chartComponents/blockComponent';

function SingleColumn(){

    const chart:Chart = useContext(ChartContext);
    const metadata: ChartMetaData = chart.metaData;
    const blocks: Block[] = chart.blocks;

	return (<>
        <ChartMetaDataComponent {...metadata}/>
        <BlockComponent {...blocks[0]}/>
        <BlockComponent {...blocks[1]}/>
        <BlockComponent {...blocks[2]}/>
    </>);
}

export default SingleColumn;
