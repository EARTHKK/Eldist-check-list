import React, { Component } from 'react';
import '../App.css';
import { Form, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import axios from 'axios';
import UserProfile from './userProfile';

class personalInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      wantedAge: "",
      previousIncome: "",
      birthDate: new Date()
    }
  }

  inputChangedHandler = (e) => {
    const updatedKeyword = e.target.value;
    const id = e.target.id;
    this.setState({ [id]: updatedKeyword })
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
  }

  calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

  handleSelect = date => {
    this.setState({
      birthDate: date
    })
  }

  handleValidation(e) {
    var value = this.state.previousIncome
    if (value.trim() === "") {
      return "กรุณากรอกข้อมูลให้ครบถ้วน"
    } else if (!(value.trim().match(/^\d+$/))) {
      this.setState({ previousIncome: "" })
      return "กรุณาเติมเฉพาะตัวเลขเท่านั้น"
    }
    var age = this.state.wantedAge
    if (age.trim() === "") {
      return "กรุณากรอกข้อมูลให้ครบถ้วน"
    } else if (!(age.trim().match(/^\d+$/))) {
      this.setState({ wantedAge: "" })
      return "กรุณาเติมเฉพาะตัวเลขเท่านั้น"
    } else if (parseInt(age) <= this.calculate_age(this.state.birthDate)) {
      this.setState({ wantedAge: "" })
      return "อายุที่คุณอยากอยู่ถึงน้อยกว่าหรือเท่ากับอายุปัจจุบันของคุณ"
    } else if (parseInt(age) > 122) {
      return false
    }
    return true
  }

  postData = (e) => {
    e.preventDefault();
    var headers = { 'Authorization': UserProfile.getToken() }
    var url = 'https://jooirb3gbb.execute-api.ap-northeast-1.amazonaws.com/default/eldistDBConnector'
    var datetime = this.state.birthDate.toJSON()
    axios.post(url,{ 'op': 'register', 'date': datetime, 'wantedAge': this.state.wantedAge, 'previousIncome': this.state.previousIncome},{headers:headers})
  }

  onClickSubmitButton = (e) => {
    e.preventDefault();
    if (this.handleValidation() === true) {
      if (window.confirm("คุณเกิดวันที่ " + this.state.birthDate.getDate() + " เดือน " + this.state.birthDate.getMonth() + " ปี " + this.state.birthDate.getFullYear() + "\nรายได้ที่ยกมาเท่ากับ " + this.state.previousIncome + " บาท\nเมื่อกดตกลงแล้วจะไม่สามารถกลับไปแก้ไขได้อีก")) {
        this.postData(e);
        this.props.setPageRoute(2);
      }
    } else if (this.handleValidation() === false) {
      if (window.confirm("รู้หรือไม่? มนุษย์ที่อายุยืนมากที่สุดบนโลกที่มีการบันทึกไว้คือ 122 ปี\nคุณจะทำสถิติ Guiness World Record จริงๆหรือ?")) {
        this.postData(e);
        this.props.setPageRoute(2);
      }

    } else {
      window.alert(this.handleValidation(e))
    }

  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.onClickSubmitButton(e)
    }
  }

  render() {
    let { date, previousIncome, wantedAge } = this.state
    return (
      <div>
        <h1 className="middleTitle">Eldist check-list</h1>
        <hr />
        <h1>โปรดกรอกข้อมูลของท่านตามช่องที่กำหนด</h1>
        <h5 className="required">*จำเป็น</h5>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Group>
            <Form.Label>วันเกิดของคุณ</Form.Label>
            <br />
            <DatePicker
              id="date"
              value={date}
              placeholder="*วันเกิด"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              selected={this.state.birthDate}
              onChange={this.handleSelect}
              onKeyDown={this.handleKeyDown}
            ></DatePicker>
          </Form.Group>

          <Form.Group>
            <Form.Label>อายุบั้นปลายที่อยากไปให้ถึง</Form.Label>
            <Form.Control
              id="wantedAge"
              pattern="[0-9]*"
              value={wantedAge}
              placeholder="*อายุ"
              onChange={this.inputChangedHandler}
              onKeyDown={this.handleKeyDown}
              required
            ></Form.Control>
          </Form.Group>
        </Form>

        <Form onSubmit={this.handleFormSubmit}>
          <Form.Group>
            <Form.Label>รายได้ที่ยกมา</Form.Label>
            <Form.Control
              id="previousIncome"
              pattern="[0-9]*"
              value={previousIncome}
              placeholder="*กรอกจำนวนเงิน"
              onChange={this.inputChangedHandler}
              onKeyDown={this.handleKeyDown}
              required
            ></Form.Control>
          </Form.Group>
        </Form>

        <br />
        <Button className="submitButton" onClick={this.onClickSubmitButton}>บันทึก</Button>
      </div>
    );
  }
}

export default personalInfoForm;