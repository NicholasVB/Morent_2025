import React from "react";

import "./FormField.scss"

export const FormField = ({labelText, placeholderText, type="text"}) => {
    return (
        <label >
            {labelText}
            <input type={type} placeholder={placeholderText} />
        </label>
    )
}