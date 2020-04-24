import React, { Component } from 'react';
import '../App.css';
import { Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import UserProfile from './userProfile';

class incomeAndPaymentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeForm: [{ title: "", value: "" }],
      paymentForm: [{ title: "", value: "" }]
    }
  }

  handleIncome = (e) => {
    if (["title", "value"].includes(e.target.className)) {
      let incomeForm = [...this.state.incomeForm]
      incomeForm[e.target.dataset.id][e.target.className] = e.target.value
      this.setState({ incomeForm })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  handlePayment = (e) => {
    if (["title", "value"].includes(e.target.className)) {
      let paymentForm = [...this.state.paymentForm]
      paymentForm[e.target.dataset.id][e.target.className] = e.target.value
      this.setState({ paymentForm })
    } else {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  addIncome = (e) => {
    this.setState((prevState) => ({
      incomeForm: [...prevState.incomeForm, { title: "", value: "" }],
    }));
  }

  removeIncome = (e) => {
    let vals = [...this.state.incomeForm]
    vals.pop()
    this.setState({
      incomeForm: vals
    })
  }

  addPayment = (e) => {
    this.setState((prevState) => ({
      paymentForm: [...prevState.paymentForm, { title: "", value: "" }],
    }));
  }

  removePayment = (e) => {
    let vals = [...this.state.paymentForm]
    vals.pop()
    this.setState({
      paymentForm: vals
    })
  }

  logConsole = (e) => {
    e.preventDefault()
  }

  onClickSubmitButton = (e) => {
    e.preventDefault();
    if (this.handleValidation() === true) {
      this.postData(e)
      this.props.setPageRoute(3);
    } else {
      window.alert(this.handleValidation())
    }
  }

  onClickCancelButton = (e) => {
    e.preventDefault();
    this.props.setPageRoute(3);
  }

  postData = (e) => {
    e.preventDefault();
    var url = 'https://jooirb3gbb.execute-api.ap-northeast-1.amazonaws.com/default/eldistDBConnector'
    var headers = { 'Authorization': UserProfile.getToken() }
    console.log(this.state)
    axios.post(url,{'op': 'append', 'incomeForm': this.state.incomeForm, 'paymentForm': this.state.paymentForm},{headers:headers}).then(res => {
      console.log(res.data)
    })
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.onClickSubmitButton(e)
    }
  }

  handleValidation = (e) => {
    var incomeField = this.state.incomeForm;
    var paymentField = this.state.paymentForm;
    for (var i in incomeField) {
      if (incomeField[i].title === "" || incomeField[i].value === "") {
        return "กรุณากรอกข้อมูลให้ครบถ้วน"
      }
      if (incomeField[i].value.trim().match(/^\d+$/) == null) {
        return "ในช่องทางขวามือกรุณาเติมเฉพาะตัวเลขเท่านั้น"
      }
    }
    for (var j in paymentField) {
      if (paymentField[j].title === "" || paymentField[j].value === "") {
        return "กรุณากรอกข้อมูลให้ครบถ้วน"
      }
      if (paymentField[j].value.trim().match(/^\d+$/) == null) {
        return "ในช่องทางขวามือกรุณาเติมเฉพาะตัวเลขเท่านั้น"
      }
    }
    return true
  }

  clearToken = (e) => {
    e.preventDefault()
    UserProfile.setLogout()
    this.props.setDefault()
  }


  render() {
    let { incomeForm, paymentForm } = this.state
    return (
      <div>
        <h1 className="middleTitle">Eldist check-list</h1>
        <a href="/" className="topright2" onClick={this.clearToken}>ออกจากระบบ</a>
        <hr />
        <h1>โปรดกรอกข้อมูลของท่านตามช่องที่กำหนด</h1>
        <h5 className="required">*จำเป็น</h5>

        <Form onSubmit={this.handleSubmit} onChange={this.handleIncome}>
          <Form.Group >
            <Form.Label>แหล่งรายได้ปัจจุบันของท่าน</Form.Label>
            {
              incomeForm.map((val, idx) => {
                let incomeId = `income-${idx}`, valId = `val-${idx}`
                return (
                  <InputGroup className="mb-3" key={idx}>
                    <input
                      placeholder="*เช่น กองทุนสำรองเลี้ยงชีพ"
                      variant="outline-secondary"
                      name={incomeId}
                      data-id={idx}
                      id={incomeId}
                      value={incomeForm[idx].title}
                      className="title"
                      onChange={this.logConsole}
                      onKeyDown={this.handleKeyDown}
                      required
                    >
                    </input>
                    <input
                      placeholder="*กรอกจำนวนรายได้ต่อเดือน"
                      aria-describedby="basic-addon1"
                      name={valId}
                      data-id={idx}
                      id={valId}
                      value={isNaN(parseInt(incomeForm[idx].value)) ? "" : String(parseInt(incomeForm[idx].value))}
                      className="value"
                      onChange={this.logConsole}
                      onKeyDown={this.handleKeyDown}
                      required
                    ></input>
                  </InputGroup>
                )
              })
            }
          </Form.Group>
          <Button onClick={this.addIncome}>+</Button>
          <Button className="btn-remove" onClick={this.removeIncome}>-</Button>
        </Form>

        <Form onSubmit={this.handleSubmit} onChange={this.handlePayment}>
          <Form.Group >
            <Form.Label>แหล่งรายจ่ายปัจจุบันของท่าน</Form.Label>
            {
              paymentForm.map((val, idx) => {
                let paymentId = `payment-${idx}`, valId = `val-${idx}`
                return (
                  <InputGroup className="mb-3" key={idx}>
                    <input
                      placeholder="*เช่น ค่าเช่าบ้าน"
                      variant="outline-secondary"
                      name={paymentId}
                      data-id={idx}
                      id={paymentId}
                      value={paymentForm[idx].title}
                      className="title"
                      onChange={this.logConsole}
                      onKeyDown={this.handleKeyDown}
                      required
                    >
                    </input>
                    <input
                      placeholder="*กรอกจำนวนรายจ่ายต่อเดือน"
                      aria-describedby="basic-addon1"
                      name={valId}
                      data-id={idx}
                      id={valId}
                      value={isNaN(parseInt(paymentForm[idx].value)) ? "" : String(parseInt(paymentForm[idx].value))}
                      className="value"
                      onChange={this.logConsole}
                      onKeyDown={this.handleKeyDown}
                      required
                    ></input>
                  </InputGroup>
                )
              })
            }
          </Form.Group>
          <Button onClick={this.addPayment}>+</Button>
          <Button className="btn-remove" onClick={this.removePayment}>-</Button>
        </Form>
        <br />
        <Button variant="secondary" className="cancelButton" onClick={this.onClickCancelButton}>ยกเลิก</Button>
        <Button className="submitButton" onClick={this.onClickSubmitButton}>บันทึก</Button>
      </div>
    );
  }
}

export default incomeAndPaymentForm;