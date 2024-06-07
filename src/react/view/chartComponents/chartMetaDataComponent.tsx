import React, { useEffect, useState} from 'react'
import { ChartMetaData } from '../../model/chartMetaData';
import "./styles/chartMetaDataStyles.scss"


function ChartMetaDataComponent(chartMetaData:ChartMetaData){

	return (<div className='oac-col oac-row-align-top'>
		<h1 className='oac-title'>{chartMetaData.title}</h1>
		<div className='oac-row'>
			<p className='oac-metadata'>Key - {chartMetaData?.keyValue?.printName ?? ''}</p>
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