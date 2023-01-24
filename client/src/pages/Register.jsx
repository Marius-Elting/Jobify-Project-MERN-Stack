import React from 'react'
import { useState, useEffect } from 'react';
import { Alert, Logo } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { FormRow } from '../components';
import { useAppContext } from '../context/appContext';
import { useNavigate } from "react-router-dom"
// global context and useNavigate later

const initialState = {
    name: '',
    email: '',
    password: '',
    isMember: true,
};


const Register = () => {
    const [values, setValues] = useState(initialState);
    const { user, isLoading, showAlert, displayAlert, registerUser, loginUser, setupUser } = useAppContext()
    const navigate = useNavigate()


    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const toggleMember = () => {
        setValues({ ...values, isMember: !values.isMember })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
        const { name, email, password, isMember } = values
        if (!email || !password || (!isMember && !name)) {
            displayAlert()
            return
        }
        const currentUser = { name, email, password }
        if (isMember) {
            setupUser({ currentUser, endPoint: "login", alertText: "Logging in..." })
        } else {
            setupUser({ currentUser, endPoint: "register", alertText: "User created! Redirecting ..." })
        }
    }
    useEffect(() => {
        setTimeout(() => {
            if (user) {
                navigate("/")
            }

        }, 1000)
    }, [user, navigate])

    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? "Login" : "Register"}</h3>
                {showAlert && <Alert />}

                {/* name field */}
                {!values.isMember && <FormRow
                    type='text'
                    name='name'
                    value={values.name}
                    handleChange={handleChange}
                />}
                <FormRow
                    type='email'
                    name='email'
                    value={values.email}
                    handleChange={handleChange}
                />
                <FormRow
                    type='password'
                    name='password'
                    value={values.password}
                    handleChange={handleChange}
                />
                <button type='submit' className='btn btn-block' disabled={isLoading} >
                    submit
                </button>
                <p>{
                    values.isMember ? "Not a memer yet?" : "Already a member"}
                    <button type="button" onClick={toggleMember} className="member-btn">
                        {
                            values.isMember ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </Wrapper>
    );
}

export default Register
