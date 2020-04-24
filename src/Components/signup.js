import React, { Component } from "react";
import axios from 'axios';
import '../App.css';
import { Button } from 'react-bootstrap';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            signupRes: ""
        }
    }

    handleChange = (e) => {
        const updatedKeyword = e.target.value;
        const id = e.target.id;
        this.setState({ [id]: updatedKeyword })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.onClickSubmitButton(e)
        }
    }

    onClickSubmitButton = async (e) => {
        e.preventDefault();
        var url = 'https://lr4eblj2k2.execute-api.ap-northeast-1.amazonaws.com/beta/user/signup'
        await axios.post(url, { 'username': this.state.email, 'email': this.state.email, 'password': this.state.password, 'name': this.state.name.concat(" ", this.state.surname) }).then(res => {
            this.setState({ signupRes: res.data })
        })
        if (this.state.signupRes.success === false && this.state.signupRes.error === true) {
            this.showAlert(this.state.signupRes.message)
        }
        if (this.state.signupRes.success === true && this.state.signupRes.message === "Please confirm your signup, check Email for validation code") {
            alert(this.state.signupRes.message)
            this.props.setSignupState(true);
        }
    }

    showAlert(msg) {
        alert(msg)
    }

    onclickSignInLabel = (e) => {
        e.preventDefault();
        this.props.isAlreadyRegister(true);
    }

    render() {
        let { name, surname, email, password } = this.state
        return (
            <form>
                <h1 className="middleTitle">Eldist check-list</h1>
                <hr />
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={this.handleChange}
                        placeholder="First name"
                        onKeyDown={this.handleKeyDown}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="surname"
                        value={surname}
                        onChange={this.handleChange}
                        placeholder="Last name"
                        onKeyDown={this.handleKeyDown}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <Button type="submit" className="btn btn-primary btn-block" onClick={this.onClickSubmitButton}>Sign Up</Button>
                <p className="forgot-password text-right">
                    Already registered <a href="/#" onClick={this.onclickSignInLabel}>sign in?</a>
                </p>
            </form>
        );
    }
}