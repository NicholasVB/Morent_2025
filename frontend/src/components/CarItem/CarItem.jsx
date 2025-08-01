import React from 'react';
import { Link } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { setCurrentCarID } from '../../redux/slices/carList';

import "./CarItem.scss"

const icons = ["/engine.svg", "/gas-station.svg", "/profile-2user.svg"];

export const CarItem = ({id, carName, carClass, imgUrl, specs, price}) => {
    const dispatch = useDispatch();

    // imgUrl = imgUrl.match(/(?<=\/cars).+/gm);

    const [size, setSize] = React.useState({});
    const ref = React.useRef(window);
    const baseSizeList = [767, 1280, 1440];

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
    }, []);



    let HTMLsizeChoiser = new Map();
    HTMLsizeChoiser.set(1440,         
    <>
        <div className='item-body'>
            <div className='item-body__title'>
                <div className="item-body__carName">{carName}</div>
                <div className="item-body__carClass">{carClass}</div>
            </div>
            <div className="item-body__img">
                {/* <img src={`https://morent-backend-xavm.onrender.com/static/cars${imgUrl}`} alt=""/> */}
                <img src={`${imgUrl}`} alt=""/>
                {/* <img src={imgUrl} alt=""/> */}
            </div>
            <div className="item-body__specs">
                {specs 
                    ? specs.map((characteristic, index) => 
                        <div className='specs__block'>
                            <div className="specs__img">
                                <img src={"/static" + icons[index]} alt=""/>
                            </div>
                            <p className='text'>{characteristic}</p>
                        </div>) 
                    : <p>None</p>
                }
                <div className="item-body__price">
                    <p className='text'><span>{price}/</span>day</p>
                </div>
            </div>
            
            <div className="item-body__btns">
                <div className="about-btn btn_white btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}}  to="/car" className="about-btn__link">About</Link></div>
                <div className="rent-now-btn btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}} to="/rent" className="rent-now-btn__link">Rent Now</Link></div>
            </div>
        </div>
    </>
    )
    HTMLsizeChoiser.set(1280, 
    <>
        <div className='item-body'>
            <div className='item-body__title'>
                <div className="item-body__carName">{carName}</div>
                <div className="item-body__carClass">{carClass}</div>
            </div>
            <div className="item-body__img">
                {/* <img src={`https://morent-backend-xavm.onrender.com/static/cars${imgUrl}`} alt=""/> */}
                <img src={`${imgUrl}`} alt=""/>
                {/* <img src={imgUrl} alt=""/> */}
            </div>
            <div className="item-body__specs specs">
                {specs 
                    ? specs.map((characteristic, index) => 
                        <div className='specs__block'>
                            <div className="specs__img">
                                <img src={"/static" + icons[index]} alt=""/>
                            </div>
                            <p className='text'>{characteristic}</p>
                        </div>) 
                    : <p>None</p>
                }
            </div>
            
            <div className="item-body__btns">
                <div className="item-body__price">
                    <p className='text'><span>{price}/</span>day</p>
                </div>
                <div className="about-btn btn_white btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}}  to="/car" className="about-btn__link">About</Link></div>
                <div className="rent-now-btn btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}} to="/rent" className="rent-now-btn__link">Rent Now</Link></div>
            </div>
        </div>
    </>
    )

    HTMLsizeChoiser.set(767, 
        <>
            <div className='item-body'>
                <div className='item-body__title'>
                    <div className="item-body__carName">{carName}</div>
                    <div className="item-body__carClass">{carClass}</div>
                </div>
                <div className='item-body__center-block'>
                    <div className="item-body__img">
                        {/* <img src={`https://morent-backend-xavm.onrender.com/static/cars${imgUrl}`} alt=""/> */}
                        <img src={`${imgUrl}`} alt=""/>
                        {/* <img src={imgUrl} alt=""/> */}
                    </div>
                    <div className="item-body__specs">
                    {specs 
                        ? specs.map((characteristic, index) => 
                            <div className='specs__block'>
                                <div className="specs__img">
                                    <img src={"/static" + icons[index]} alt=""/>
                                </div>
                                <p className='text'>{characteristic}</p>
                            </div>) 
                        : <p>None</p>
                    }
                    </div>
                </div>
                <div className='item-body__footer-block'>
                    <div className="item-body__price">
                        <p className='text'><span>{price}/</span>day</p>
                    </div>
                    <div className="item-body__btns">
                        <div className="about-btn btn_white btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}}  to="/car" className="about-btn__link">About</Link></div>
                        <div className="rent-now-btn btn"><Link onClick={() => {dispatch(setCurrentCarID(id))}} to="/rent" className="rent-now-btn__link">Rent Now</Link></div>
                    </div>
                </div>    
            </div>
        </>
    )

    


    return (
        HTMLsizeChoiser.get(size.innerWidth)
    )
}
