import React from "react";
import { Link, useNavigate} from "react-router-dom"
import { setCurentAuthSession } from "../../redux/slices/auth";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axiosConfigs/axiosConfig";

import "./Header.scss";

export const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let isAuth = useSelector(state => state.auth.curentAuthSession);
    
    
    let [size, setSize] = React.useState({});
    const ref = React.useRef(window);
    const baseSizeList = [767, 1440];
    
    const resizeHandler = () => {
        let { innerHeight, innerWidth } = ref.current || {};
        for (let baseSize of baseSizeList) {
            if (baseSize >= innerWidth) {
                innerWidth = baseSize
                break;
            }
        }
        if (innerWidth > baseSizeList[baseSizeList.length - 1]) {
            innerWidth = baseSizeList[baseSizeList.length - 1];
        }
        setSize({ innerHeight, innerWidth });
    };


    React.useEffect(() => {

        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [])

    let HTMLsizeChoiser = new Map();

    async function logout() {
        let refresh = window.localStorage.getItem("refresh")
        // const response = await axios.post("https://morent-backend-xavm.onrender.com/api/logout/", {refresh});
        const response = await axios.post("/api/logout/", {refresh});
        window.localStorage.removeItem("access");
        window.localStorage.removeItem("refresh");
        dispatch(setCurentAuthSession(false));
        navigate("/");
    }

    HTMLsizeChoiser.set(1440,
        <>
            <header className="header">
                <div className="header__container">
                    <div className="logo">
                        <div className="logo__text">
                            <Link to="/">MORENT</Link>
                        </div>
                    </div>
                    <div className="header__menu menu">
                        <div className="menu__items">
                            <Link className="menu__item" to="/About"><div  className="menu__item-link">About</div></Link>
                            {/* <div className="menu__item"><div to="/Community" className="menu__item-link">Community</div></div> */}
                            <Link className="menu__item" to="/socials"><div  className="menu__item-link">Socials</div></Link>
                        </div>
                    </div>
                    <div className="header__btns-block">
                        <div className="login btn">
                            {isAuth 
                                ? <Link to="/profile" className="login__link link">Profile</Link>
                                : <Link to="/login" className="login__link link">Login</Link> 
                            }
                        </div>
                        {isAuth 
                            ? <button className="login btn btn_white" onClick={logout}>                        
                                <div className="login__link link">Logout</div>
                            </button>
                            : <div></div> 
                        }
                    </div>
                </div>
                
            </header>
        </>
    )
    
    function toggleBurgerState (e) { 
        document.querySelector(".icon-menu").classList.toggle("_active");
        document.querySelector(".menu").classList.toggle("open");
        document.querySelector(".menu__items").classList.toggle("open");
    }

    HTMLsizeChoiser.set(767,
        <>
            <header className="header">
                <div className="header__container">
                    <div className="logo" onClick={() => {
                        if (document.querySelector(".icon-menu").classList.contains("_active")) {
                            toggleBurgerState()
                        }
                        }}>
                        <div className="logo__text">
                            <Link to="/">MORENT</Link>
                        </div>
                    </div>
                    
                    <div className="header__btns-block">
                        <button type='button' class='icon-menu' onClick={toggleBurgerState}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
                
            </header>
            <div className="header__menu menu">
                <div className="menu__items" onClick={toggleBurgerState}>
                    <Link className="menu__item" to="/About"><div  className="menu__item-link">About</div></Link>
                    <Link className="menu__item" to="/socials"><div className="menu__item-link">Socials</div></Link>
                    {isAuth 
                        ? <Link to="/profile" className="menu__item"><div className="menu__item-link">Profile</div></Link>
                        : <Link to="/login" className="menu__item menu__item-link"><div className="menu__item-link">Login</div></Link> 
                    }
                    {isAuth 
                        ? <button className="menu__item" onClick={logout}>                        
                            <div className="menu__item-link">Logout</div>
                            </button>
                        : <div></div> 
                    }
                </div>
            </div>
        </>    
    )
    
    return(
        HTMLsizeChoiser.get(size.innerWidth)
    )
}
