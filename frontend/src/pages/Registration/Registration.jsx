import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../axiosConfigs/axiosConfig";

import "./Registration.scss"

export const Registration = () => {
    const navigate = useNavigate();
    
    const {
        register, 
        getValues,
        formState:{errors, isValid},
        handleSubmit,
        reset
    } = useForm({
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("/api/register/", data);
            if (response.status === 200) {
                navigate("/login")
            }
            
        } catch (error) {
            // нужно проверять что пришло в ответе? Например, что уже есть аткой пользователь или просто показывать alert 
            alert("Не удалось зарегистрироваться")
        }
        // reset()
    }

    return (
        <>
            <div className="registration">
                <div className="registration__container">
                    <div className="registration__body">
                        <div className="registration__title-block title-block">
                            <div className="title-block__title ">Registration</div>
                            <div className="title-block__sub-title">Please enter your registration info</div>
                        </div>
                        <form action="" onSubmit={handleSubmit(onSubmit)}>
                            <label>
                                Login
                                <input placeholder="Your login"  {...register("username", {
                                    required: "field is required",
                                    minLength: {
                                        value: 3,
                                        message: 'minimum length 3 characters'
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9]+$/,
                                        message: 'login is not valid'
                                    }
                                })} />
                                <div className="field-error">
                                    {errors?.username?.message}
                                </div>
                            </label>
                            <label>
                                Email
                                <input placeholder="Your email"  {...register("email", {
                                    required: "field is required",
                                    pattern: {
                                        // value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                        value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
                                        message: 'email is not valid'
                                    }
                                    
                                })} />
                                <div className="field-error">
                                    {errors?.email?.message}
                                </div>
                            </label>
                            <label>
                                Password
                                <input placeholder="Your password" type="password"
                                {...register("password", {
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
                            <label>
                                Confirm password
                                <input placeholder="Confirm your password" type="password" 
                                {...register("confirm", {
                                    required: "field is required",
                                    validate: value => value === getValues("password") || 'confirm and password not equal'
                                })}
                                />
                                <div className="field-error">
                                    {errors?.confirm?.message}
                                </div>
                            </label>
                            <div className="registration__buttons">
                                <Link to="/" className="btn btn_white link">Back to main</Link>
                                {/* <button type="submit" className="btn link {}" disabled={!isValid}> */}
                                <button type="submit" className={`btn link ${!isValid ? "btn_disabled" : ''}`} >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}