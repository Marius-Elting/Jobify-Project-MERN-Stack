import React from 'react'
import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import { Logo } from '../components'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo></Logo>
            </nav>
            <div className="cointainer page">
                <div className="info">
                    <h1>job <span>tracking</span>app</h1>
                    <p>I'm baby unicorn edison bulb authentic actually messenger bag typewriter ennui iPhone banh mi biodiesel ramps. Tonx next level fixie plaid hell of lumbersexual direct trade. </p>
                    <Link to="/register" className="btn btn-hero">Login/Register</Link>
                </div>
                <img src={main} alt="mainimage" className="img main-img"></img>
            </div>
        </Wrapper>
    )
}





export default Landing



