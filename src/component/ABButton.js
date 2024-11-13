import { Button } from 'antd'
import React from 'react'

function ABButton(props) {
    const { label, onClick, disabled, loading } = (props)

    return (
        <>
            <Button
                type="primary"
                label={label}
                disabled={disabled}
                loading={loading}
                onClick={onClick}
            >
                {label}
            </Button>

        </>


    )
}

export default ABButton