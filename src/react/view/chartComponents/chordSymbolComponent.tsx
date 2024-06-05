import React, { useEffect, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';
function ChordSymbolComponent(chordWrapper:ChordWrapper) {
	return (<>
		<p>
			{chordWrapper.root.printName}
			{chordWrapper.quality}
			{chordWrapper.extension}
			
		</p>
	</>);
}

export default ChordSymbolComponent;