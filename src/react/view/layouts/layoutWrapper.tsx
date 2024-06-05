import React, { useState } from 'react'
import SingleColumn from './singleColumn';
import DoubleColumn from './doubleColumn';
import SingleRow from './singleRow';
import { LayoutMode } from '../enums/layoutMode';

const LayoutWrapper = () => {

    const [mode, setMode] = useState<LayoutMode>(LayoutMode.SINGLE_COLUMN);
	return (<>
        {mode === LayoutMode.SINGLE_COLUMN && <SingleColumn/>}
        {mode === LayoutMode.DOUBLE_COLUMN && <DoubleColumn/>}
        {mode === LayoutMode.SINGLE_ROW && <SingleRow/>}
    </>);
}

export default LayoutWrapper
