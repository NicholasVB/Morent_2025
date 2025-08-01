import React from "react";
import { useDispatch } from "react-redux";

import "./Pagination.scss";

export const Pagination = ({reqLen, itemList, actionfn}) => {
    const dispatch = useDispatch();
    
    const ChankSize = 5;
    const max = Math.ceil(reqLen/ChankSize);
    let [currentPage, setCurrentPage] = React.useState(1);
    let endPoiner = currentPage * ChankSize;
    let startPoiner = endPoiner - ChankSize;
    
    let renderPages = itemList.slice(startPoiner, endPoiner);


    React.useEffect(() => {
        dispatch(actionfn(renderPages));
    }, [currentPage])

    React.useEffect(() => {
        paginate(1)
        dispatch(actionfn(renderPages));
    }, [itemList])

    const paginate = (currentPage) => {
        if (currentPage > max) {
            setCurrentPage(max)
        }
        if (currentPage < 1 || currentPage > max) return;
        setCurrentPage(currentPage)
    }

    return (
        <div className='pagination'>
            <div className="pagination__body">
                <div className="pagination__btn_left btn" onClick={() => paginate(currentPage - 1, max, setCurrentPage)}>
                    <img src="/static/ArrowLeft.png" alt=""/>
                </div>
                <div className="pagination__text-body">
                    <p>{currentPage} of {max}</p>
                </div>
                    
                <div className="pagination__btn_right btn" onClick={() => paginate(currentPage + 1, max, setCurrentPage)}>
                    <img src="/static/ArrowRight.png" alt=""/>
                </div>
            </div>
        </div>
    )
}