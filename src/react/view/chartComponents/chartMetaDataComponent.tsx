import React, { useEffect, useState } from 'react'
import { ChartMetaData } from '../../model/chartMetaData';


const ChartMetaDataComponent = (chartMetaData: ChartMetaData) => {
	return (<>
		<strong>{chartMetaData.title}</strong>
		<p>{chartMetaData.keyValue.printName}</p>
		<p>{chartMetaData.signatureTop}</p>
		<p>{chartMetaData.signatureBottom}</p>
		<p>{chartMetaData.tempo}</p>
	</>
	);
}

export default ChartMetaDataComponent;