import React, { Component } from 'react';
import PersonalInfoForm from './Components/personalInfoForm'
import IncomeAndPaymentForm from './Components/incomeAndPaymentForm'
import SignUp from './Components/signup'
import Login from './Components/login'
import CfSignUp from "./Components/cfSignup"
import Summary from './Components/summary.'
import { Jumbotron } from 'react-bootstrap';
import './App.css';
import UserProfile from './Components/userProfile';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagenumber: 3,
            isSignin: false,
            isClickSigninPage: false,
            isClickSignUp: false
        };
    }

    setPageRoute = (pageNumber) => {
        this.setState({
            pagenumber: pageNumber
        })
    }

    setSigninState = (isSignin) => {
        this.setState({
            isSignin: isSignin
        })
    }

    isAlreadyRegister = (isClickSigninPage) => {
        this.setState({
            isClickSigninPage: isClickSigninPage
        })
    }

    setSignupState = (isClickSignUp) => {
        this.setState({
            isClickSignUp: isClickSignUp
        })
    }

    setDefault = (e) => {
        this.setState({
            pagenumber: 3,
            isSignin: false,
            isClickSigninPage: false,
            isClickSignUp: false
        })
    }

    componentDidMount() {
        if (UserProfile.getToken() !== undefined){
            this.setSigninState(true)
        }
    }

    render() {
        return (
            <div>
                {this.state.isSignin === false
                    ?
                    this.state.isClickSigninPage === false
                        ?
                        this.state.isClickSignUp === false
                            ?
                            <Jumbotron className="loginRegis"><SignUp isAlreadyRegister={this.isAlreadyRegister} setSignupState={this.setSignupState} /></Jumbotron>
                            :
                            <Jumbotron className="loginRegis"><CfSignUp setPageRoute={this.setPageRoute} setSigninState={this.setSigninState} /></Jumbotron>
                        :
                        <Jumbotron className="loginRegis"><Login setSigninState={this.setSigninState} /></Jumbotron>
                    :
                    this.state.pagenumber === 1
                        ?
                        <Jumbotron className="info"><PersonalInfoForm setPageRoute={this.setPageRoute} /></Jumbotron>
                        :
                        this.state.pagenumber === 2
                            ?
                            <div>
                                <Jumbotron className="info"><IncomeAndPaymentForm setPageRoute={this.setPageRoute} setDefault={this.setDefault}/></Jumbotron>
                            </div>
                            :
                            <div>
                                <Jumbotron className="summary"><Summary setPageRoute={this.setPageRoute} setDefault={this.setDefault}/></Jumbotron>
                            </div>
                }
            </div>
        );
    }
}

export default App;