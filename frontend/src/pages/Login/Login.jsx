import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import { setCurentAuthSession } from "../../redux/slices/auth";
import axios from "../../axiosConfigs/axiosConfig";

import "./Login.scss"

export const Login = () => {
    const isAuth = useSelector(state => state.auth.curentAuthSession);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        formState:{errors, isValid},
        handleSubmit,
        reset
    } = useForm({
        mode: "onChange",
    });

    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [info, setInfo] = React.useState();
    
    async function fetchAuth(params) {
        try {
            const response = await axios.post("/api/login/", params);
            if (response.status === 401) {
                dispatch(setCurentAuthSession(false));
                alert("Неверный логин или пароль, повторите попытку.")    
            }
            if (response.status === 200) {
                dispatch(setCurentAuthSession(true));
                setIsLoaded(true);
                setInfo(response.data);
                navigate("/");
            }
        } catch (error) {
            if (error.response.status === 401) {
                    dispatch(setCurentAuthSession(false));
                    // navigate("/login");
                    alert("Неверный логин или пароль, повторите попытку.")
                    console.log("Неверный логин или пароль, повторите попытку.")
                }
            if (error.response.status === 200) {
                dispatch(setCurentAuthSession(true));
                setIsLoaded(true);
                setInfo(error.response.data);
                navigate("/");
            }
        }
    }     
    // React.useEffect(() => {
    //     fetchAuth(data)
    // },[])

    const onSubmit = async (data) => { 
        fetchAuth(data);
        // reset()
    }

    if (isAuth) {
        return <Navigate to="/" />
    }

    return (
        <>
            <div className="login">
                <div className="login__container">
                    <div className="login__body">
                        <div className="login__title-block title-block">
                            <div className="title-block__title ">Authorisation</div>
                            <div className="title-block__sub-title">Please enter your authorisation info</div>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>
                                Login
                                <input placeholder="Your login" {...register("username", {
                                    required: "field is required",
                                    minLength: {
                                        value: 3,
                                        message: 'minimum length 3 characters'
                                    },
                                    pattern: {
                                        value: /^[A-z0-9]+$/,
                                        message: 'login is not valid'
                                    }
                                    
                                })} />
                                <div className="field-error">
                                    {errors?.username?.message}
                                </div>
                            </label>
                            <label>
                                Password
                                <input placeholder="Your password" type="password" {...register("password", {
                                    required: "field is required",
                                    minLength: {
                                        value: 8,
                                        message: 'minimum length 8 characters'
                                    },
                                })} />
                                <div className="field-error">
                                    {errors?.password?.message}
                                </div>
                            </label>                                            
                            <div className="login__sign-up sign-up">
                                <div className="sign-up__text">Don`t have an account?</div>
                                <Link to="/registration" className="sign-up__link">Sign up</Link>
                            </div>
                            <div className="login__buttons">
                                <Link to="/" className="login__btn btn btn_white">Back to main</Link>
                                <button type="submit" className={`btn link ${!isValid ? "btn_disabled" : ''}`}>
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}