import React from "react";
import { useSelector } from "react-redux";
import "./css/Home.css";
import logo from "./../img/Logo_secretVoldemort.png";

const Home = (props) => {
    const {history} = props;

    const { isLoggedIn } = useSelector((state) => state.auth);
    return (
        <div className="fondo">            
            <div className="logo">
                <img className="image" src={logo} alt="carta no carga"/>   
            </div>
         
            {isLoggedIn ? (
            <div className="fondo-home-button">
                <button className="button-match" onClick={() => history.push("/match")}>
                    Create Match
                </button>
                <button className="button-show" onClick={() => history.push("/show_match")}>
                    Show Match
                </button>
            </div>
            ):(
            <div className="fondo-home-button">
                <button className="button-match" onClick={() => history.push("/register")}>
                    Sign Up
                </button>
                <button className="button-show" onClick={() => history.push("/login")}>
                    Sign In
                </button>
            </div>
            )}
        </div>
    )
};

export default Home;