import React, { useContext, useEffect, useState } from 'react'
import { ChartContext, useChartContext } from '../programWindow';
import { ChartMetaData } from '../../model/chartMetaData';
import { Block } from '../../model/block';
import BlockComponent from '../chartComponents/blockComponent';
import ChartMetaDataComponent from '../chartComponents/metadata/chartMetaDataComponent';

function SingleColumn(){
    const {chartEditingState} = useChartContext();
    const chart = chartEditingState.chart
    const metadata: ChartMetaData = chart.metaData;
    const blocks: Block[] = chart.children;

	return (<>
        <ChartMetaDataComponent {...metadata}/>
        {!blocks && <strong>No blocks</strong>}
        {blocks && blocks.length > 0 && blocks.map((block: Block) => {
            return <BlockComponent key = {block.id} {...block}/>
        })}
    </>);
}

export default SingleColumn;
