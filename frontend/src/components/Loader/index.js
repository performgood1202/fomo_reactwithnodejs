import React from "react";
import './loader.scss';

export default function Loader() {
    return (
        <div className="loader-overlay" id="loader-div">
            <div id="loader"></div>
        </div>
    );
}