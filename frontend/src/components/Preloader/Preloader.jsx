import React from "react";

import "./Preloader.scss";


export const Preloader = () => {
    let [approximateTime, setApproximateTime] = React.useState(70);

    React.useEffect(() => {
        let timer = setInterval(() => {
            setApproximateTime(approximateTime - 1);
    
        }, 1000);
        
        return () => clearInterval(timer);
    }, [approximateTime]);

    return (
        <>
            <div className="preloader">
                <div className="preloader-image-body">
                    <svg className="preloader-image-body__image" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="#3563E9"
                        d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z">
                        </path>
                    </svg>
                </div>

                <div className="preloader__timer preloader-timer">
                    <div className="preloader-timer__text">
                        Sorry, our server is currently loading,<br/> it will take approximately  <span>{approximateTime}</span> seconds.
                    </div>
                </div>
                
            </div>
        </>
    );
}