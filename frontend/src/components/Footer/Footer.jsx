import React from "react";
import "./Footer.scss"

export const Footer = () => {
    return(
        <>
            <footer className="footer">
                <div className="footer__container">
                    <div className="footer__body body-footer">
                        <div className="body-footer__item">©2023 MORENT.</div>
                        <div className="body-footer__item">Privacy & Policy.</div>
                        <div className="body-footer__item">All rights reserved.</div>
                        <div className="body-footer__item">Terms & Condition.</div>
                    </div>
                </div>
            </footer>
        </>
        )
}