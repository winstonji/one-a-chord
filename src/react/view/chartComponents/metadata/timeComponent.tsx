import React from "react";
import TimeUpperComponent from "./timeUpperComponent";
import TimeLowerComponent from "./timeLowerComponent";

function TimeComponent(props: { signatureTop: number, signatureBottom: number }) {
    const { signatureTop, signatureBottom } = props;

    return <>
        <p>Time - </p>
        <div className='oac-col oac-metadata'>
            <TimeUpperComponent signatureTop={signatureTop}/> 
            <TimeLowerComponent signatureBottom={signatureBottom}/>
        </div>
    </>
}

export default TimeComponent;