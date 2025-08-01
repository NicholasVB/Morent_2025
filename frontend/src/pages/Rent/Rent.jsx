import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import { setCurentAuthSession } from "../../redux/slices/auth";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

import axios from "../../axiosConfigs/axiosConfig";

import "./Rent.scss"

export const Rent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const [infoError, setInfoError] = React.useState(null);
    const [infoIsLoaded, setInfoIsLoaded] = React.useState(false);
    const [info, setInfo] = React.useState();

    async function fetchProfileData() {
        try {
            const response = await axios.get("/api/profile/");
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
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

    const [citys, setCitys] = React.useState();
    async function fetchCitysList() {
        try {
            const response = await axios.get("/api/city");
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
            }
            if (response.status === 200) {
                setCitys(response.data);
            }
        } catch (error) {
            if (error.response.status === 401) {
                dispatch(setCurentAuthSession(false));
                navigate("/login");
            }
        }
    }  

    let { listOfCars } = useSelector(state => state.carssList);
    let { currentCarID } = useSelector(state => state.carssList);
    let curentCar;
    if (currentCarID !== 0){
        curentCar = listOfCars.filter(car => car.id === currentCarID)[0];
    }

    React.useEffect(() => {
        fetchCitysList()
        fetchProfileData()
    }, [])

    const {
        register,
        formState:{errors},
        handleSubmit,
        control,
        reset
    } = useForm({
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        let username = info.id;
        try {
            let response;
            if (currentCarID !== 0) {
                let car = curentCar.id;
                // response = await axios.post("https://morent-backend-xavm.onrender.com/api/payment/", {... data, username, car});
                response = await axios.post("/api/payment/", {... data, username, car});
            } else {
                // response = await axios.post("https://morent-backend-xavm.onrender.com/api/payment/", {... data, username});
                response = await axios.post("/api/payment/", {... data, username});
            } 
            
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
                navigate("/login");
            }
            if (response.status === 200) {
                dispatch(setCurentAuthSession(true));
                navigate("/");
            }
        } catch (error) {
            // 400
            if (error.response.status === 401) {
                dispatch(setCurentAuthSession(false));
                navigate("/login");
            }
        }
    }
    

    return (
        <>
            <div className="form">
                <div className="form__container">
                    <div className="form__body">
                        <div className="form__title-block title-block">
                            <div className="title-block__title ">Billing Info</div>
                            <div className="title-block__sub-title">Please enter your billing info</div>
                        </div>

                        <form action="" onSubmit={handleSubmit(onSubmit)}>

                            <label>
                                Name
                                <input placeholder="Your name"  {...register("name", {
                                    required: "field is required",
                                    pattern: {
                                        value: /^[^0-9!@#$%^&?*()_+='`\/;~{}:"\-\[\]\.,\\<>\|]+$/,
                                        message: 'name is not valid'
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "name is not full"
                                    }  
                                })} />
                                <div className="field-error">
                                    {errors?.name?.message}
                                </div>
                            </label>

                            <label>
                                Phone Number
                                <input placeholder="Phone number"  {...register("phone_number", {
                                    required: "field is required",
                                    pattern: {
                                        value: /^[^a-zA-Z!@#$%^&?*_'=`\/;~{}:"\-\[\]\.,\\<>\|]+$/,
                                        message: 'phone number is not valid'
                                    },
                                    minLength: {
                                        value: 11,
                                        message: "phone number is not full"
                                    },
                                    maxLength: {
                                        value: 13,
                                        message: "phone number is too long"
                                    }
                                })} />
                                <div className="field-error">
                                    {errors?.phone_number?.message}
                                </div>
                            </label>

                            <label>
                                Adress
                                <input placeholder="Your adress"  {...register("adress", {
                                    required: "field is required",
                                    pattern: {
                                        value: /^[^!@#$%^&?*()_+=`\/;~{}:"\-\[\]\.,\\<>\|]+$/,
                                        message: 'adress is not valid'
                                    }
                                })} />
                                <div className="field-error">
                                    {errors?.adress?.message}
                                </div>
                            </label>
                            
                            <label>
                                Town / City
                                <input placeholder="Your town / city"  {...register("city", {
                                    required: "field is required",
                                    pattern: {
                                        value: /^[^0-9!@#$%^&?*()_+='`\/;~{}:"\-\[\]\.,\\<>\|]+$/,
                                        message: 'city name is not valid'
                                    }   
                                })}/>
                                <div className="field-error">
                                    {errors?.city?.message}
                                </div>
                            </label>

                        </form>

                    </div>
                </div>
            </div>

            <div className="form">
                <div className="form__container">
                    <div className="form__body">
                        <div className="form__title-block title-block">
                            <div className="title-block__title ">Rental Info</div>
                            <div className="title-block__sub-title">Please select your rental date</div>
                        </div>
                        <span></span><div className="title-block__title ">Pick - Up</div>

                        <form action="" onSubmit={handleSubmit(onSubmit)}>

                            <label>
                                Locations
                                <select 
                                    name="Age"
                                    {...register("pick_up_city", {
                                        required: true,
                                    })}
                                >
                                    <option>{"Select your city"}</option>
                                    {(citys ? citys : Array(3)).map(item => {
                                        return <option value={item.name}>{item.name}</option>
                                    })}
                                </select>
                            </label>
                            
                            <label>
                                Date
                                <Controller
                                    control={control}
                                    name="pick_up_date"
                                    rules={{ 
                                        required: "field is required"    
                                    }}
                                    render={({ field: { onChange, ref } }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']} sx={{ width: '100%', paddingTop: "0px"}}>
                                                <DatePicker
                                                    className="Input"
                                                    format="DD/MM/YYYY"
                                                    onChange={(value) => {onChange(dayjs(value).format('YYYY-MM-DD'))}}
                                                    inputRef={ref}
                                                    slotProps={{ textField: { placeholder: "Select your date"} }} sx= {
                                                        {   
                                                            '& .MuiOutlinedInput-root': { borderRadius: "10px"},
                                                            '& .MuiInputBase-input': {minHeight: "28px"},
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 0},
                                                            '& .MuiInputBase-input::placeholder': { fontFamily: "Plus Jakarta Sans", opacity: 1, lineHeight: "200%"}
                                                        }
                                                    } 
                                                   />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    )}
                                />
                                <div className="field-error">
                                    {errors?.pick_up_date?.message}
                                </div>
                            </label>

                            <label>
                                Time
                                <Controller
                                    control={control}
                                    name="pick_up_time"
                                    rules={{ 
                                        required: "field is required"    
                                    }}
                                    render={({ field: { onChange, ref } }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['TimePicker']} sx={{ width: '100%', paddingTop: "0px"}}>
                                                <TimePicker
                                                    className="Input" 
                                                    format="HH:mm"
                                                    views={["hours", "minutes"]}
                                                    onChange={(value) => {onChange(dayjs(value).format('HH:mm'))}}
                                                    inputRef={ref}
                                                    slotProps={{ textField: { placeholder: "Select your time"} }} sx= {
                                                        {   
                                                            '& .MuiOutlinedInput-root': { borderRadius: "10px"},
                                                            '& .MuiInputBase-input': {minHeight: "28px"},
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 0},
                                                            '& .MuiInputBase-input::placeholder': { fontFamily: "Plus Jakarta Sans", opacity: 1, lineHeight: "200%"}
                                                        }
                                                    }
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    )}
                                />
                                <div className="field-error">
                                    {errors?.pick_up_time?.message}
                                </div>
                            </label>

                            <label>
                                Car
                                {currentCarID !== 0 
                                    ?   <input placeholder="Your car" readonly value={curentCar.car_name} {...register("car", {
                                            required: true,
                                        })}/>
                                    :   <select 
                                            {...register("car", {
                                                required: true,
                                            })}
                                        >
                                            <option>{"Your car"}</option>
                                            {(listOfCars ? listOfCars : Array(3)).map(car => {
                                                return <option value={car.id}>{car.car_name}</option>
                                            })}
                                        </select>  
                                }
                            </label>
                        </form>

                        <span></span><div className="title-block__title ">Drop - Off</div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            
                            <label>
                                Locations
                                <select 
                                    {...register("drop_off_city", {
                                        required: true,
                                    })}
                                >
                                    <option>{"Select your city"}</option>
                                    {(citys ? citys : Array(3)).map(item => {
                                        return <option value={item.name}>{item.name}</option>
                                    })}
                                </select>
                            </label>

                            <label>
                                Date
                                <Controller
                                    control={control}
                                    name="drop_off_date"
                                    rules={{ 
                                        required: "field is required"    
                                    }}
                                    render={({ field: { onChange, ref } }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']} sx={{ width: '100%', paddingTop: "0px"}}>
                                                <DatePicker 
                                                    className="Input"
                                                    format="DD/MM/YYYY"
                                                    onChange={(value) => {onChange(dayjs(value).format('YYYY-MM-DD'))}}
                                                    inputRef={ref}
                                                    slotProps={{ textField: { placeholder: "Select your date"} }} sx= {
                                                        {   
                                                            '& .MuiOutlinedInput-root': { borderRadius: "10px"},
                                                            '& .MuiInputBase-input': {minHeight: "28px"},
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 0},
                                                            '& .MuiInputBase-input::placeholder': { fontFamily: "Plus Jakarta Sans", opacity: 1, lineHeight: "200%"}
                                                        }
                                                    } 
                                                   />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    )}
                                />
                                <div className="field-error">
                                    {errors?.drop_off_date?.message}
                                </div>
                            </label>

                            <label>
                                Time
                                <Controller
                                    control={control}
                                    name="drop_off_time"
                                    rules={{ 
                                        required: "field is required"    
                                    }}
                                    render={({ field: { onChange, ref } }) => (
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DemoContainer components={['TimePicker']} sx={{ width: '100%', paddingTop: "0px"}}>
                                                <TimePicker
                                                    className="Input" 
                                                    format="HH:mm"
                                                    views={["hours", "minutes"]}
                                                    onChange={(value) => {onChange(dayjs(value).format('HH:mm'))}}
                                                    inputRef={ref}
                                                    slotProps={{ textField: { placeholder: "Select your time"} }} sx= {
                                                        {   
                                                           '& .MuiOutlinedInput-root': { borderRadius: "10px"},
                                                            '& .MuiInputBase-input': {minHeight: "28px"},
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 0},
                                                            '& .MuiInputBase-input::placeholder': { fontFamily: "Plus Jakarta Sans", opacity: 1, lineHeight: "200%"}
                                                        }
                                                    }
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    )}
                                />
                            </label>
                            
                        </form>
                    </div>
                </div>
            </div>

            <div className="form">
                <div className="form__container">
                    <div className="form__body">
                        <div className="form__title-block title-block">
                            <div className="title-block__title ">Confirmation</div>
                            <div className="title-block__sub-title">We are getting to the end. Just few clicks and your rental is ready!</div>
                        </div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <label className="checkbox-body">{"I agree with sending an Marketing and newsletter emails. No spam, promissed!"}
                                <input type='checkbox' {...register("agree1", {
                                    value: "I agree with sending an Marketing and newsletter emails. No spam, promissed!",
                                    required: true,
                                })} />
                            </label>
                            <label className="checkbox-body">{"I agree with our terms and conditions and privacy policy."}
                                <input type='checkbox' {...register("agree2", {
                                    value: "I agree with our terms and conditions and privacy policy.",
                                    required: true,
                                })} />
                            </label>
                            <div className="form__buttons">
                                <Link to="/" className="btn btn_white link">Back to main</Link>
                                <button type="submit" className="btn link">
                                    Rent Now
                                </button>
                            </div>
                        </form>
                        <div className="confirm-end-block">
                            <img src={"static/safe-image.svg"} className="img"></img>
                            <div className="title-block__title ">All your data are safe</div>
                            <div className="title-block__sub-title">We are using the most advanced security to provide you the best experience ever.</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
