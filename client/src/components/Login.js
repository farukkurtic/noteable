import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "./Header";
import Footer from "./Footer";

export default function Login () {

    const [cookie, setCookie] = useCookies(["userID"]);
    const navigate = useNavigate();

    const [userExists, setUserExists] = useState(true);
    const [loginError, setLoginError] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    const initialValues = {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object({
        email: Yup.string()
                    .email("Invalid email address.")
                    .required("This field is required."),
        password: Yup.string()
                    .required("This field is required.")
    });

        const handleSubmit = async function(values, {setSubmitting, resetForm}) {

            async function checkEmail() {
                try {
                    const response = await axios.get(`http://localhost:3001/auth/check/${values.email}`);
                    return response.data.exists;
                } catch (error) {
                    console.log("error:", error);
                }
            }

            try {

                const exists = await checkEmail();

                if(!exists) {
                    setUserExists(false);
                } else {

                    try {

                        const response = await axios.post(`http://localhost:3001/auth/login`, values);
                        console.log(response.data);
                        setUserExists(true);
                        setCookie("userID", response.data, {path:"/"});
                        navigate("/dashboard");
                        
                    } catch (error) {
                        console.log("Error:", error);
                        setLoginError(true);
                    }

                }
                
            } catch (error) {
                console.log("Error:", error);
            }
        }

    return (
        <div>

            <ul class="background">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>

            <Header/>
            <div className="home-container">

                <div className="container-image">
                    <img src="/images/note-clip.png" alt="note image" />
                </div>

                <div className="container-form">

                    <div className="above-form"></div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >                    

                    <Form className="form">

                        <h1 className="mb-3">Log in</h1>
                        <p className="mb-4">Pick up where you left off</p>

                        <div className="mb-3">                         
                            <Field className="form-control" type="email" id="email" name="email" placeholder="Email" autocomplete="off"/>
                            <ErrorMessage className="error-message mt-2" name="email" component="div" />
                        </div>

                        <div className="mb-3"> 
                            <div className="password-container">
                                <Field className="form-control" type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Password" autocomplete="off" />
                                <span onClick={togglePasswordVisibility}>{showPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa-regular fa-eye"></i>}</span>
                            </div>
                            <ErrorMessage className="error-message mt-2" name="password" component="div" />
                        </div>
                     

                        <button className="btn btn-lg mt-4 mb-4" type="submit">Log in</button>

                        { !userExists ? <p>User not found. Try again or sign up <a href="/register">here</a></p>
                        : userExists && !loginError ? <p>Not a member? Sign up <a href="/register">here</a></p> : <p>Email and password combination is incorrect. Try again or sign up <a href="/register">here</a></p> }

                    </Form>

                    </Formik>

                </div>
            </div>
            <Footer/>
        </div>
    );
}