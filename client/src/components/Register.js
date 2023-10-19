import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "./Header";
import Footer from "./Footer";

export default function Register () {

    const [cookie, setCookie] = useCookies(["userID"]);
    const navigate = useNavigate();

    const [userExists, setUserExists] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    };

    const validationSchema = Yup.object({
        firstName: Yup.string()
                    .max(15, "Must be 15 characters or less")
                    .required("This field is required."),
        lastName: Yup.string()
                    .max(15, "Must be 15 or less characters long")
                    .required("This field is required."),
        email: Yup.string()
                    .email("Invalid email address")
                    .required("This field is required."),
        password: Yup.string()
                    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, "Password must contain at least 8 characters, including one letter, and one number.")
                    .required("This field is required."),
        confirmPassword: Yup.string()
                    .oneOf([Yup.ref("password"), null], "Passwords must match.")
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

                if(exists) {
                    setUserExists(true);
                } else {

                    try {

                        const response = await axios.post(`http://localhost:3001/auth/register`, values);
                        console.log(response.data);
                        setUserExists(false);
                        setCookie("userID", response.data, {path:"/"});
                        navigate("/login")
                        
                    } catch (error) {
                        console.log("Error:", error);
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

                        <h1 className="mb-3">Sign Up</h1>
                        <p className="mb-4">Let's get you started</p>

                        <div className="mb-3">
                            <Field className="form-control" type="text" id="firstName" name="firstName" placeholder="First name" autocomplete="off"/>
                            <ErrorMessage className="error-message mt-2" name="firstName" component="div"/>
                        </div>

                        <div className="mb-3">                      
                            <Field className="form-control" type="text" id="lastName" name="lastName" placeholder="Last name" autocomplete="off"/>
                            <ErrorMessage className="error-message mt-2" name="lastName" component="div"/>
                        </div>

                        <div className="mb-3">                         
                            <Field className="form-control" type="email" id="email" name="email" placeholder="Email" autocomplete="off"/>
                            <ErrorMessage className="error-message mt-2" name="email" component="div" />
                        </div>

                        <div className="mb-3"> 
                            <div className="password-container">
                                <Field className="form-control" type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Password" autocomplete="off"/>
                                <span onClick={togglePasswordVisibility}>{showPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa-regular fa-eye"></i>}</span>
                            </div>
                            <ErrorMessage className="error-message mt-2" name="password" component="div" />
                        </div>

                        <div>
                            <div className="password-container">
                                <Field className="form-control" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="Confirm password" autocomplete="off"/>
                                <span onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? <i class="fa-regular fa-eye-slash"></i> : <i class="fa-regular fa-eye"></i>}</span>
                            </div>
                            <ErrorMessage className="error-message mt-2" name="confirmPassword" component="div" />
                        </div>                        

                        <button className="btn btn-lg mt-4 mb-4" type="submit">Sign up</button>

                        { userExists ? <p>User already exists. Try <a href="/login">logging in</a></p>
                        : <p>Already a member? <a href="/login">Log in</a></p> }

                    </Form>

                    </Formik>

                </div>
            </div>
            <Footer/>
        </div>
    );
}