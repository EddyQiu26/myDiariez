import React from 'react';
import '../CSS/Alert.css'

const Alert = ({type='danger', message='lorem ipsum idit sit'}) => {
    switch(type.toLowerCase()){
        case 'danger':
            return <div className='alertContainer'><div className='dangerAlert alert'>{message}</div></div>
        case 'warning':
            return <div className='alertContainer'><div className='warningAlert alert'>{message}</div></div>
        case 'success':
            return <div className='alertConatiner'><div className='successAlert alert'>{message}</div></div>
        default: return null;
    }
}

export default Alert