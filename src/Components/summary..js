import React, { Component } from 'react';
import { Table, Popconfirm, Typography } from 'antd';
import '../App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import UserProfile from './userProfile';

class summary extends Component {
    _mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            date: "",
            incomeForm: "",
            paymentForm: "",
            previousIncome: "",
            wantedAge: "",
            count: 0,
        }
    }

    getData = (e) => {
        var headers = { 'Authorization': UserProfile.getToken() }
        var url = 'https://jooirb3gbb.execute-api.ap-northeast-1.amazonaws.com/default/eldistDBConnector'

        axios.post(url,{ 'op': 'get'},{headers:headers}).then(res => {
            /*console.log(res.data)*/
            if(this._mounted){
            this.setState({ username: res.data.Item.fullName })
            this.setState({ date: res.data.Item.date })
            if(res.data.Item.incomeForm !== undefined && res.data.Item.paymentForm !== undefined) {
                this.setState({ incomeForm: res.data.Item.incomeForm })
                this.setState({ paymentForm: res.data.Item.paymentForm })
            }
            this.setState({ previousIncome: res.data.Item.previousIncome })
            this.setState({ wantedAge: res.data.Item.wantedAge })
        }
        })
    }

    async componentDidMount() {
        this._mounted = true;
        this.interval = setInterval(() => {
            this.setState(({ count }) => ({ count: count + 1 }));
            this.getData();
            if (this.state.count >= 5) { clearInterval(this.interval) }
        }, 1000);
    }

    componentWillUnmount() {
        this._mounted = false;
        clearInterval(this.interval);
    }

    getIncomeData() {
        const income = this.state.incomeForm;
        var incomeData_ = []
        for (var i = 0; i < income.length; i++) {
            var tmp = income[i]
            tmp['key'] = String(i)
            incomeData_.push(tmp)
        }
        return incomeData_
    }
    getPaymentData() {
        const payment = this.state.paymentForm;
        var paymentData_ = []
        for (var i = 0; i < payment.length; i++) {
            var tmp = payment[i]
            tmp['key'] = String(i)
            paymentData_.push(tmp)
        }
        return paymentData_
    }

    calculate_age(dob) {
        var date = new Date(dob)
        var diff_ms = Date.now() - date.getTime();
        var age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    onClickhandler = (e) => {
        e.preventDefault();
        this.props.setPageRoute(parseInt(e.target.name));
    }

    fundCalc(param) {
        var sumIncome = 0
        for (var i = 0; i < this.state.incomeForm.length; i++) {
            sumIncome += parseInt(this.state.incomeForm[i].value)
        }
        var sumPayment = 0
        for (i = 0; i < this.state.paymentForm.length; i++) {
            sumPayment += parseInt(this.state.paymentForm[i].value)
        }
        var income = parseInt(this.state.previousIncome) + (parseInt(this.state.wantedAge - this.calculate_age(this.state.date)) * 12 * sumIncome)
        var payment = (parseInt(this.state.wantedAge - this.calculate_age(this.state.date)) * 12 * sumPayment)
        if (param === "beforeCal") {
            var fund = Math.floor(((income) / 12) / (this.state.wantedAge - this.calculate_age(this.state.date)))
            return fund
        }
        else if (param === "afterCal") {
            fund = Math.floor(((income - payment) / 12) / (this.state.wantedAge - this.calculate_age(this.state.date)))
            return fund
        }
    }

    checkFund = (e) => {
        if (this.fundCalc("afterCal") < 0) {
            return <h4>เงินของท่านติดลบ ท่านต้องหาเงินเพิ่มอย่างน้อยเดือนละ {-this.fundCalc("afterCal")} บาท ท่านถึงจะอยู่ได้แบบพอดี(ตามรายการที่ยกมา ไม่รวมรายการอย่างอื่น)</h4>
        }
        return <h4>ตามเป้าหมาย ท่านจะต้องใช้เงินไม่เกินเดือนละ {this.fundCalc("beforeCal")} บาท (ก่อนหักค่าใช้จ่าย) หรือ {this.fundCalc("afterCal")} บาท (หลังหักค่าใช้จ่าย)</h4>
    }

    async handleDeleteIncome(key) {
        const incomeForm = await [...this.state.incomeForm];
        await this.setState({ incomeForm: incomeForm.filter(item => item.key !== key) });
        var headers = { 'Authorization': UserProfile.getToken() }
        var url = 'https://jooirb3gbb.execute-api.ap-northeast-1.amazonaws.com/default/eldistDBConnector'
        await axios.post(url, { 'op': 'replaceIncome', data: this.state.incomeForm},{headers:headers})
    };

    async handleDeletePayment(key) {
        const paymentForm = await [...this.state.paymentForm];
        await this.setState({ paymentForm: paymentForm.filter(item => item.key !== key) });
        var headers = { 'Authorization': UserProfile.getToken() }
        var url = 'https://jooirb3gbb.execute-api.ap-northeast-1.amazonaws.com/default/eldistDBConnector'
        await axios.post(url, { 'op': 'replacePayment', data: this.state.paymentForm},{headers:headers})
    };

    clearToken = (e) => {
        e.preventDefault()
        UserProfile.setLogout()
        this.props.setDefault()
    }

    render() {
        const { Text } = Typography;
        const personalColumns = [
            {
                title: "ชื่อผู้ใช้",
                dataIndex: "username",
                key: "username"
            },
            {
                title: "อายุ",
                dataIndex: "age",
                key: "age"
            },
            {
                title: "อายุเป้าหมาย",
                dataIndex: "wantedAge",
                key: "wantedAge"
            },
            {
                title: "รายได้ที่ยกมา",
                dataIndex: "previousIncome",
                key: "previousIncome"
            }
        ]
        const incomeColumns = [
            {
                title: "ประเภทรายได้",
                dataIndex: "title",
                key: "title"
            },
            {
                title: "จำนวน(บาท)",
                dataIndex: "value",
                key: "value"
            },
            {
                title: '',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.incomeForm.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteIncome(record.key)}>
                            <a href="/#">Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        const paymentColumns = [
            {
                title: "ประเภทรายจ่าย",
                dataIndex: "title",
                key: "title"
            },
            {
                title: "จำนวน(บาท)",
                dataIndex: "value",
                key: "value"
            },
            {
                title: '',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.paymentForm.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeletePayment(record.key)}>
                            <a href="/#">Delete</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        const personalData = [
            {
                key: '1',
                username: this.state.username,
                age: this.calculate_age(this.state.date),
                wantedAge: this.state.wantedAge,
                previousIncome: this.state.previousIncome
            }
        ];
        const incomeData = this.getIncomeData();
        const paymentData = this.getPaymentData();
        let checkFund = this.checkFund();
        return (
            <div>
                <h1 className="middleTitle">Eldist check-list</h1>
                <a href="/" className="topright" onClick={this.clearToken}>ออกจากระบบ</a>
                <hr />
                {checkFund}
                <br />
                <Table columns={personalColumns} dataSource={personalData} bordered />
                <hr />
                <p className="required">หากท่านต้องการแก้ไขข้อมูล ให้กด Delete ช่องที่ต้องการแก้ไข จากนั้นกดปุ่ม Add ด้านล่างสุดเพื่อไปหน้าเพิ่มข้อมูล</p>
                <p className="required">หากข้อมูลยังไม่ได้รับการแก้ไข โปรดรอซักครู่ หรือ Reload หน้านี้อีกครั้ง</p>
                <Table
                    columns={incomeColumns}
                    dataSource={incomeData}
                    bordered
                    summary={pageData => {
                        let totalIncome = 0
                        pageData.forEach(({ value }) => {
                            totalIncome += parseInt(value);
                        });

                        return (
                            <>
                                <tr>
                                    <th>รวมรายได้ต่อเดือน</th>
                                    <td>
                                        <Text>{parseInt(totalIncome)} บาท</Text>
                                    </td>
                                </tr>
                            </>
                        )
                    }
                    }
                />
                <Table
                    columns={paymentColumns}
                    dataSource={paymentData}
                    bordered
                    summary={pageData => {
                        let totalPayment = 0
                        pageData.forEach(({ value }) => {
                            totalPayment += parseInt(value);
                        });

                        return (
                            <>
                                <tr>
                                    <th>รวมรายจ่ายต่อเดือน</th>
                                    <td>
                                        <Text>{parseInt(totalPayment)} บาท</Text>
                                    </td>
                                </tr>
                            </>
                        )
                    }
                    }
                />
                <Button name='2' onClick={this.onClickhandler}>Add</Button>
            </div>
        );
    }
}

export default summary;