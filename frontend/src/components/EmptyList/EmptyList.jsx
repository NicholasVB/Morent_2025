import React from "react";

import "./EmptyList.scss";
export const EmptyList = () => {
    return (
        <div className="empty-list">
           <div className="empty-list__body">
                <div className="empty-list__text">
                    Product list is empty
                </div>           
            </div>
        </div>
    )
}