import React, { useEffect, useState} from 'react'
import { ChartMetaData } from '../../model/chartMetaData';


function ChartMetaDataComponent(chartMetaData:ChartMetaData){

	return (<>
		<h1>{chartMetaData.title}</h1>
		<p>{chartMetaData.keyValue.printName}</p>
		<p>{chartMetaData.signatureTop}</p>
		<p>{chartMetaData.signatureBottom}</p>
		<p>{chartMetaData.tempo}</p>
	</>
	);
}

export default ChartMetaDataComponent;