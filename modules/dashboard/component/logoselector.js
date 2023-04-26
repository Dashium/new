/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

const LogoSelector = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
    };

    return (
        <div className="logo-selector">
            {options.map((option) => (
                <div
                    key={option.id}
                    id={`option-${option.id}`}
                    className={`option ${option === selectedOption ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(option)}
                >
                    <option.logo />
                    <div className="label">{option.label}</div>
                </div>
            ))}
        </div>
    );
};

export default LogoSelector;
