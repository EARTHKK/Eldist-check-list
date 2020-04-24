import React, { Component } from "react";
import UserProfile from './userProfile';
import { Button, Form, FormGroup } from 'react-bootstrap';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isChecked: false,
            loginRes: ""
        }
    }

    toggleChange = (e) => {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    handleChange = (e) => {
        const updatedKeyword = e.target.value;
        const id = e.target.id;
        this.setState({ [id]: updatedKeyword })
    }

    postLoginData = async (e) => {
        e.preventDefault();
        var url = 'https://lr4eblj2k2.execute-api.ap-northeast-1.amazonaws.com/beta/user/login'
        await axios.post(url, { 'username': this.state.email, 'password': this.state.password }).then(res => {
            this.setState({ loginRes: res.data })
        })
        if (this.state.loginRes.success === false && this.state.loginRes.error === true) {
            this.showAlert(this.state.loginRes.message)
        }
        if (this.state.loginRes.success === true && this.state.loginRes.error === false) {
            if (this.state.isChecked === false) {
                await UserProfile.setToken(this.state.loginRes.data.access_token)
                this.props.setSigninState(true)
            } else if (this.state.isChecked === true) {
                await UserProfile.setRememberToken(this.state.loginRes.data.access_token)
                this.props.setSigninState(true)
            }
        }
    }

    showAlert(msg) {
        alert(msg)
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.postLoginData(e)
        }
    }

    onClickLoginButton = (e) => {
        e.preventDefault();
        this.postLoginData(e);
    }

    render() {
        let { email, password, isChecked } = this.state
        return (
            <Form>
                <h1 className="middleTitle">Eldist check-list</h1>
                <hr />
                <h3>Sign In</h3>

                <FormGroup>
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
                </FormGroup>

                <FormGroup>
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={this.handleChange}
                        placeholder="Enter password"
                        onKeyDown={this.handleKeyDown}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck1"
                            checked={isChecked}
                            onChange={this.toggleChange}
                        />
                        <label
                            className="custom-control-label"
                            htmlFor="customCheck1"
                        >
                            Remember me for 7 days
                        </label>
                    </div>
                </FormGroup>

                <Button onClick={this.onClickLoginButton}>Login</Button>
                <p className="forgot-password text-right">
                    Forgot <a href="/#">password?</a>
                </p>
            </Form>
        );
    }
}