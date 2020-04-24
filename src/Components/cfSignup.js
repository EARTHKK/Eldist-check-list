import React, { Component } from "react";
import UserProfile from './userProfile';
import { Button } from 'react-bootstrap';
import '../App.css';
import axios from 'axios';

export default class CfSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            code: "",
            isChecked: false,
            cfRes: "",
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

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.postConfirmationData(e)
        }
    }

    postConfirmationData = async (e) => {
        e.preventDefault();
        var url = 'https://lr4eblj2k2.execute-api.ap-northeast-1.amazonaws.com/beta/user/confirm-signup'
        await axios.post(url, { 'email': this.state.email, 'password': this.state.password, 'code': this.state.code }).then(res => {
            this.setState({ cfRes: res.data })
        })
        if (this.state.cfRes.success === false && this.state.cfRes.error === true) {
            this.showAlert(this.state.cfRes.message)
        }
        if (this.state.cfRes.success === true && this.state.cfRes.error === false) {
            await this.postLoginData(e);
        }
    }

    postLoginData = async (e) => {
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
                await this.props.setPageRoute(1)
                this.props.setSigninState(true)
            } else if (this.state.isChecked === true) {
                await UserProfile.setRememberToken(this.state.loginRes.data.access_token)
                await this.props.setPageRoute(1)
                this.props.setSigninState(true)
            }
        }
    }

    showAlert(msg) {
        alert(msg)
    }

    onClickCompleteButton = (e) => {
        e.preventDefault();
        this.postConfirmationData(e);
    }

    render() {
        let { email, password, code, isChecked } = this.state
        return (
            <form>
                <h1 className="middleTitle">Eldist check-list</h1>
                <hr />
                <h3>Confirmation and Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={this.handleChange}
                        placeholder="Enter email"
                        onKeyDown={this.handleKeyDown}
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
                        placeholder="Enter password"
                        onKeyDown={this.handleKeyDown}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Verification code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="code"
                        value={code}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        placeholder="Enter verification code"
                        required
                    />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="customCheck1"
                            onChange={this.toggleChange}
                            checked={isChecked}
                        />
                        <label
                            className="custom-control-label"
                            htmlFor="customCheck1"
                        >
                            Remember me for 7 days
                        </label>
                    </div>
                </div>

                <Button onClick={this.onClickCompleteButton}>Complete Signup</Button>

            </form>
        );
    }
}