import React, { useEffect, useState} from 'react'
import "../styles/chartMetaDataStyles.scss"
import { ChartMetaData } from '../../../model/chartMetaData';
import TitleComponenent from './titleComponent';
import KeyComponent from './keyComponent';
import TempoComponent from './tempoComponent';
import TimeComponent from './timeComponent';


function ChartMetaDataComponent(chartMetaData: ChartMetaData){

	return (<div className='oac-col oac-row-align-top'>
		<TitleComponenent title = {chartMetaData.title}/>
		<div className='oac-row'>
			<KeyComponent keySig={chartMetaData?.keyValue?.printName ?? ''}/>
			<TimeComponent signatureTop={chartMetaData.signatureTop} signatureBottom={chartMetaData.signatureBottom}/>
			<TempoComponent tempo={chartMetaData?.tempo || 0}/>
		</div>
	</div>
	);
}

export default ChartMetaDataComponent;