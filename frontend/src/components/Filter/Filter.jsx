import React from "react";
import axios from 'axios';
import { FiltersGroup } from "../FiltersGroup/FiltersGroup";

import "./Filter.scss"
import { useSelector, useDispatch } from "react-redux";
import { setListOfCars } from "../../redux/slices/carList";

export const Filter = () => {
    const [filtersError, setFiltersError] = React.useState(null);
    const [filtersIsLoaded, setfiltersIsLoaded] = React.useState(false);
    const [filtersList, setFiltersList] = React.useState([]);

    async function fetchFiltersList () {
        try {
            // let response = await axios.get("https://morent-backend-xavm.onrender.com/api/all_category/")
            let response = await axios.get("http://127.0.0.1:8000/api/all_category/")
            setFiltersList(Object.entries(response.data))
        } catch (error) {
            setFiltersError(error)
        }
    }

    let [size, setSize] = React.useState({});
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


    React.useEffect(() => {
        fetchFiltersList()

        window.addEventListener("resize", resizeHandler);
        resizeHandler();

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [])

    let HTMLsizeChoiser = new Map();
    HTMLsizeChoiser.set(1440,         
        <>
            <div className='filter-component'>
                <div className='filter-component__wrapper'>
                    <div className="filter-component__body">
                        {/* <Swiper  slides-per-view="2"> */}
                            {(filtersList ? filtersList : Array(3)).map(settingsFilterGroup => {
                                return(
                                    // <SwiperSlide>
                                    <FiltersGroup key={settingsFilterGroup[0]} title={settingsFilterGroup[0]} propertyList={settingsFilterGroup[1]}></FiltersGroup>
                                    // </SwiperSlide>
                                    )
                                }
                            )}                                
                        {/* </Swiper> */}
                    </div>
                </div>
            </div>
        </>
    )
    
    function toggleFiltersBodyState(e){
        let filterComponent = document.querySelector(".filter-component");

        filterComponent.classList.toggle("open-block");        
        document.querySelectorAll(".filter-item__spoiler-body").forEach(el => el.classList.add("open"))
    }

    let [sortParametr, setSortParametr] = React.useState(1);
    const dispatch = useDispatch();
    let listCar = useSelector(state => state.carssList.listOfCars);
    const ListChanged = useSelector(state => state.carssList.listChanged);
    
    function sortListCar (listCar, sortParametr) {
        
        if (sortParametr == 1) {
            const sortable = [...Object.values(listCar)].sort((a, b) => parseInt(a.price) - parseInt(b.price));
            dispatch(setListOfCars(sortable));
        }
        if (sortParametr == 2) {
            const sortable = [...Object.values(listCar)].sort((a, b) => parseInt(b.price) - parseInt(a.price));
            dispatch(setListOfCars(sortable));
        }
    }
    
    React.useEffect(() => {
        sortListCar(listCar, sortParametr)
    }, [sortParametr, ListChanged])

    HTMLsizeChoiser.set(1280,         
        <>
            <div className="filter-component__buttons-close visible filter-buttons-close">
                <div className="filter-buttons__button-filter btn link" onClick={toggleFiltersBodyState}>Filters</div>
                <select onClick={(e) => {setSortParametr(e.target.value)}} className="filter-buttons__select-filter btn btn_white ">
                    <option  value={1}>From cheap to expensive</option>
                    <option  value={2}>From expensive to cheap</option>
                </select> 
            </div>
            <div className='filter-component'>
                <div className='filter-component__wrapper'>
                    <div className="filter-component__buttons-open filter-buttons-open">
                        <div className="filter-buttons-open__text">Filters</div>
                        <div className='filter-component__x-icon' onClick={toggleFiltersBodyState}>
                            <img src={"/x_icon.png"} alt=""/>
                        </div>
                    </div>
                    
                    <div className="filter-component__body-wrapper">
                        <div className="filter-component__body">
                            {/* <Swiper  slides-per-view="2"> */}
                                {(filtersList ? filtersList : Array(3)).map(settingsFilterGroup => {
                                    return(
                                        // <SwiperSlide>
                                        <FiltersGroup key={settingsFilterGroup[0]} title={settingsFilterGroup[0]} propertyList={settingsFilterGroup[1]}></FiltersGroup>
                                        // </SwiperSlide>
                                        )
                                    })
                                }
                            {/* </Swiper> */}
                        </div>
                    </div>

                    <div className='filter-component__buttons-open filter-buttons-open'>
                        <div className="filter-buttons-open__show btn link" onClick={toggleFiltersBodyState}>Show</div>
                    </div>
                </div>
            </div>
        </>
    )

    return(
        HTMLsizeChoiser.get(size.innerWidth)
    )
}