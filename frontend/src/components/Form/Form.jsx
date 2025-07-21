import React from "react";
import {useForm} from "react-hook-form"

import {FormField} from "../FormField/FormField";
import "./Form.scss"

export const Form = () => {
    const {
        register,
        formState:{errors},
        handleSubmit
    } = useForm();

    const onSubmit = (data) => {
        alert(JSON.stringify(data));
    }

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            imetLis.map
            <FormField labelText="Login" placeholderText="Your login"/>
            <FormField labelText="Password" placeholderText="Your password" type="password"/>
        </form>
    )
}