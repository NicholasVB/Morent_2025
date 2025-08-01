import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentCarID } from '../../redux/slices/carList';

import "./AdsCard.scss";

export const AdsCard = ({title, text, imgUrl}) => {
    const dispatch = useDispatch()
    return(
        <>
            <div className="card">
                <div className="card__description-body ">
                    <div className="card__title">The Best Platform for Car Rental</div>
                    <div className="card__text">Ease of doing a car rental safely and reliably. Of corse at a low price.</div>
                    <Link to="/rent" onClick={() => {dispatch(setCurrentCarID(0))}} className="card__btn btn">Rental Car</Link>
                </div>
                <div className="card__img-body">
                    <img src={"static" + imgUrl} alt=""/>
                </div>
            </div>

        </>
    )
}