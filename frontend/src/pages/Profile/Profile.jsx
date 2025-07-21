import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "../../components";
import { setCurentAuthSession } from "../../redux/slices/auth";
import { setRenderOrderList } from "../../redux/slices/personalFullInfo";
import axios from "../../axiosConfigs/axiosBaseSettings";

import "./Profile.scss"

export const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let {renderOrderList} = useSelector(state => state.userInfo);
    
    const [infoError, setInfoError] = React.useState(null);
    const [infoIsLoaded, setInfoIsLoaded] = React.useState(false);
    const [info, setInfo] = React.useState();

    async function fetchProfileData() {
        try {
            const response = await axios.get("/api/profile/");
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
                navigate("/login");
            }
            if (response.status === 200) {
                dispatch(setCurentAuthSession(true));
                setInfoIsLoaded(true);
                setInfo(response.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                dispatch(setCurentAuthSession(false));
                navigate("/login");
            }
        }
    }  

    const [ordersError, setOrdersError] = React.useState(null);
    const [ordersIsLoaded, setOrdersIsLoaded] = React.useState(false);
    const [orders, setOrders] = React.useState();

    async function userGetOrders() {
        try {
            const response = await axios.get("/api/profile/orders");
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
            }
            if (response.status === 200) {
                dispatch(setCurentAuthSession(true));
                setOrdersIsLoaded(true);
                setOrders(response.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                    dispatch(setCurentAuthSession(false));
                    navigate("/login");
            }
        }
    } 

    const [size, setSize] = React.useState({});
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
        fetchProfileData();
        userGetOrders();
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [])

    function capitalize (word) {
        let phrase = word.charAt(0).toUpperCase()+ word.slice(1)
        return phrase.split("_").join(" ")
    }

    let HTMLsizeChoiser = new Map();
    HTMLsizeChoiser.set(1440,         
        <div className="profile">
            <div className="profile__container">
                <div className="profile__body">
                    <div className="profile__info-block info-block">
                        <div className="info-block__title">Your profile</div>
                        <div className="info-block__list info-list">
                            <div className="info-list__subtitles">
                                {(info ? Object.keys(info).slice(1).map(item => capitalize(item)) : Array(5)).map(subtitle => <div className="info-list__subtitle">{subtitle}</div>)}
                            </div>
                            <div className="info-list__texts">
                                {(info ? Object.values(info).slice(1) : Array(5)).map(text => <div className="info-list__text">{text}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className="profile__buttons">
                        <Link to="/" className="btn btn_white link">Back to main</Link>
                        <Link to="/profile/edit" className="btn link">Change info</Link>
                        <Link  className="btn btn_disabled link">Change password</Link>
                    </div>
                    <div className="profile__orders profile-orders-block">
                        <div className="profile-orders-block__title">Your orders</div>
                        <div className="profile-orders-block__list orders-list">
                            <div className="orders-list__subtitles">
                                <div className="orders-list__subtitle">Car name</div>
                                <div className="orders-list__subtitle">Pick-up city</div>
                                <div className="orders-list__subtitle">Drop-off city</div>
                                <div className="orders-list__subtitle">Status</div>
                            </div>
                            <div className="orders-list__items">
                                {(renderOrderList ? Object.values(renderOrderList) : Array(5)).map((order, id) => 
                                    <div className="orders-list__item" key={id}>
                                        <div className="orders-list__value">{order.car_name}</div>
                                        <div className="orders-list__value">{order.pick_up_city}</div>
                                        <div className="orders-list__value">{order.drop_off_city}</div>
                                        <div className="orders-list__value">{order.status}</div>
                                    </div>                                    
                                )}
                            </div>
                            
                        </div>
                    </div>
                    {orders ? 
                        <Pagination reqLen={orders.length} itemList={orders} actionfn={setRenderOrderList}></Pagination>
                    : <div></div>
                    }
                </div>
            </div>
        </div>
    )

    function toggleSpoilerState(e){
        // console.log(e.currentTarget)
        e.currentTarget.classList.add("current");
        let elemet = document.querySelector(".current+.spoiler-body");
        elemet.classList.toggle("open");
        e.currentTarget.classList.remove("current");
    }

    HTMLsizeChoiser.set(767,         
        <div className="profile">
            <div className="profile__container">
                <div className="profile__body">
                    <div className="profile__info-block info-block">
                        <div className="info-block__title">Your profile</div>
                        <div className="info-block__list info-list">
                            <div className="info-list__subtitles">
                                {(info ? Object.keys(info).slice(1).map(item => capitalize(item)) : Array(5)).map(subtitle => <div className="info-list__subtitle">{subtitle}</div>)}
                            </div>
                            <div className="info-list__texts">
                                {(info ? Object.values(info).slice(1) : Array(5)).map(text => <div className="info-list__text">{text}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className="profile__buttons">
                        <Link to="/" className="btn btn_white link">Back to main</Link>
                        <Link to="/profile/edit" className="btn link">Change info</Link>
                        <Link  className="btn link btn_disabled">Change password</Link>
                    </div>
                    <div className="profile__orders profile-orders-block">
                        <div className="profile-orders-block__title">Your orders</div>
                        <div className="profile-orders-block__list orders-list">
                            <div className="orders-list__subtitles">
                                <div className="orders-list__subtitle">Car name</div>
                                
                            </div>
                            <div className="orders-list__items">
                                {(renderOrderList ? Object.values(renderOrderList) : Array(5)).map((order, id) => 
                                    <div className="orders-list__item " key={id}>
                                        <div className="spoiler-block" onClick={toggleSpoilerState}>
                                            <div className="orders-list__value">{order.car_name}</div>
                                            <div className="spoiler-block__icon">
                                                <img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
                                            </div>
                                        </div>
                                        
                                        <div className="spoiler-body">
                                            <div className="orders-list__subtitle">Pick-up city</div>
                                            <div className="orders-list__value">{order.pick_up_city}</div>
                                            <div className="orders-list__subtitle">Drop-off city</div>
                                            <div className="orders-list__value">{order.drop_off_city}</div>
                                            <div className="orders-list__subtitle">Status</div>
                                            <div className="orders-list__value">{order.status}</div>
                                        </div>
                                    </div>                                    
                                )}
                            </div>
                            
                        </div>
                    </div>
                    {orders ? 
                        <Pagination reqLen={orders.length} itemList={orders} actionfn={setRenderOrderList}></Pagination>
                    : <div></div>
                    }
                </div>
            </div>
        </div>
    )

    return (
        HTMLsizeChoiser.get(size.innerWidth)
    )
}