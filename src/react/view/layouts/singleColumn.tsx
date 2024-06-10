import React, { useContext, useEffect, useState } from 'react'
import { ChartContext } from '../programWindow';
import { Chart } from '../../model/chart';
import ChartMetaDataComponent from '../chartComponents/chartMetaDataComponent';
import { ChartMetaData } from '../../model/chartMetaData';
import { Block } from '../../model/block';
import BlockComponent from '../chartComponents/blockComponent';

function SingleColumn(){

    const {chart} = useContext(ChartContext);
    console.log(chart)
    const metadata: ChartMetaData = chart.metaData;
    const blocks: Block[] = chart.blocks;

	return (<>
        <ChartMetaDataComponent {...metadata}/>
        {!blocks && <strong>No blocks</strong>}
        {blocks && blocks.length > 0 && blocks.map((block: Block) => {
            return <BlockComponent {...block}/>
        })}
    </>);
}

export default SingleColumn;
