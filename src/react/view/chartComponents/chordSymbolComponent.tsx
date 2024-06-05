import React, { useEffect, useState } from 'react'
import { ChordWrapper } from '../../model/chordWrapper';

function ChordSymbolComponent(chordWrapper:ChordWrapper) {
	return (<>
		<p className='oac-chord-symbol'>
			{chordWrapper?.root?.printName ?? ''}
			{chordWrapper.quality}
			{chordWrapper.extension}
			{chordWrapper?.slash?.printName ?? ''}
		</p>
	</>);
}

export default ChordSymbolComponent;