import React from 'react';
import { Button } from 'antd';

function ABScreenHeader({ title, actionButton }) {
    return (
        <div className="rounded-lg p-5 mb-2 bg-[lightgrey] flex justify-between items-center">
            <h1 className="text-3xl">
             {title}
            </h1>
            {actionButton.map((x, index) => (
                <React.Fragment key={index}>
                    {x.display()}
                </React.Fragment>
            ))}
        </div>
    );
}

export default ABScreenHeader;
