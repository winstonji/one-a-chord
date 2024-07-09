import React, { useEffect, useState} from 'react'
import "../styles/chartMetaDataStyles.scss"
import { ChartMetaData } from '../../../model/chartMetaData';
import TitleComponenent from './titleComponent';
import KeyComponent from './keyComponent';


function ChartMetaDataComponent(chartMetaData: ChartMetaData){

	return (<div className='oac-col oac-row-align-top'>
		<TitleComponenent title = {chartMetaData.title}/>
		<div className='oac-row'>
			<KeyComponent keySig={chartMetaData?.keyValue?.printName ?? ''}/>
			<p>Time - </p>
			<div className='oac-col oac-metadata'>
				<p className='oac-time-signature'>{chartMetaData.signatureTop}</p>
				<p className='oac-time-signature'>{chartMetaData.signatureBottom}</p>
			</div>
			<p className='oac-metadata'>Tempo - {chartMetaData.tempo}</p>
		</div>
	</div>
	);
}

export default ChartMetaDataComponent;