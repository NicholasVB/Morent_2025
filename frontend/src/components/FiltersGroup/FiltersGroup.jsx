import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListOfCars, fetchAllCars, setListChanged } from '../../redux/slices/carList';
import axios from "../../axiosConfigs/axiosConfig";

import "./FiltersGroup.scss";
// import {ReactComponent as ReactLogo} from '../../../public/iconsfont/arrow-bottom';
// import {ReactComponent as ReactLogo} from 'ArrowLeft';

export const FiltersGroup = ({title, propertyList}) => {
    let ListChanged = useSelector(state => state.carssList.listChanged);
    const dispatch = useDispatch()

    // let valueTranslator = {
    //     "Category": "cat",
    //     "Engine": "engine",
    //     "Capacity": "capacity"
    // }

    async function filterCarList() {
        
        let inputsObj = Array.from(document.querySelectorAll("input"))
            .filter(item => item.checked === true )
            .reduce((rezOb, item) => {
                if (!rezOb.hasOwnProperty(item.attributes.group.nodeValue)){
                    // rezOb[valueTranslator[item.attributes.group.nodeValue]] = item.defaultValue
                    rezOb[item.attributes.group.nodeValue] = item.defaultValue
                } 
                return rezOb
            }, {})

        // групповое отключение, странная фича, удалить
        let allKeys = Array.from(document.querySelectorAll(".filter-item__title")).map(item => item.innerText);
        allKeys.forEach(key => {
            let arr = Array.from(document.querySelectorAll("input")).filter(item => item.attributes.group.nodeValue === key)
            if (arr.some(item => item.checked === true)){
                arr.filter(item => item.checked === false).forEach(item => item.disabled = true)  
            } else {
                arr.forEach(item => item.disabled = false)
            }
        })

        let paramsString = Object.entries(inputsObj).map(item => `${item[0]}=${item[1]}`).join("&")
        
        if (paramsString.length > 0){
            let params = `?${paramsString}`
            // let response = await axios.get(`https://morent-backend-xavm.onrender.com/api/filter/${params}`)
            let response = await axios.get(`/api/filter/${params}`)
            dispatch(setListOfCars(response.data))
            dispatch(setListChanged(!ListChanged));
        } else {
            // let response = await axios.get(`https://morent-backend-xavm.onrender.com/api/filter/`)
            let response = await axios.get(`/api/filter/`)
            dispatch(setListOfCars(response.data))
            dispatch(setListChanged(!ListChanged));
        }
    }




    const [size, setSize] = React.useState({});
    const ref = React.useRef(window);
    const baseSizeList = [1280, 1440];

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

    // const swiperElRef = React.useRef(null);
    React.useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        // swiperElRef.current.addEventListener('progress', (e) => {
        //     const [swiper, progress] = e.detail;
        //     console.log(progress);
        // });
        
        //     swiperElRef.current.addEventListener('slidechange', (e) => {
        //     console.log('slide changed');
        // });


        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);
  
  

    let HTMLsizeChoiser = new Map();
    HTMLsizeChoiser.set(1440,         
        <>
            <div className='filter-item'>
                <div className="filter-item__title">{title}</div>
                <div className='filter-item__parametrs-body'>
                    {propertyList 
                        ? propertyList.map(
                            item => 
                                <label key={item.name}>
                                    <input onClick={filterCarList} className='parametr' group={title} type='checkbox' value={item} />{item}
                                </label>
                            ) 
                        : <div>None</div>
                    }
                            
                </div>
            </div>
        </>
    )

    function toggleSpoilerState(e){
        // console.log(e.currentTarget)
        e.currentTarget.classList.add("current");
        let elemet = document.querySelector(".current+.filter-item__body-wrapper .filter-item__spoiler-body");
        elemet.classList.toggle("open");
        e.currentTarget.classList.remove("current");
    }
    HTMLsizeChoiser.set(1280,         
        <>
            <div className='filter-component__item filter-item'>
                <div className="filter-item__spoiler-block spoiler-block" onClick={toggleSpoilerState}>
                    <div className="filter-item__title" >{title}</div>
                    <div className="spoiler-block__icon">
                        <img src={"./iconsfont/arrow-bottom.svg"} alt=""/>
                    </div>
                </div>
                <div className='filter-item__body-wrapper'>
                    <div className="filter-item__spoiler-body">
                        {propertyList 
                            ? propertyList.map(
                                item => 
                                    <label key={item.name}>
                                        <input onClick={filterCarList} className='filter-item__parametr' group={title} type='checkbox' value={item} />{item}
                                    </label>
                                ) 
                            : <div>None</div>
                        }
                    </div>
                </div>
            </div>
        </>
    )

    return (
        HTMLsizeChoiser.get(size.innerWidth)
    )
}
