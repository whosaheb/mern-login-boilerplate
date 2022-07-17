import React from "react";
import { useSelector } from "react-redux";

const Login = () => {
    const email = useSelector((state) => state.email)
    return (
        <div className="container">
            <div className="row text-center my-3">
                <h2 className="text-primary">Login Page</h2>
                {email}
            </div>
            <div className="row">
                <form className="w-50 form__position">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" />
                    </div>
                    <div className="mb-3 text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;