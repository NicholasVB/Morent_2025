import React from 'react';
import "./Community.scss";
import {Link} from "react-router-dom";

export const Community = () => {
    return (
        <div className='Community'>
            Page Community
            <Link to="/">Go HOME</Link>
        </div>
    )
}