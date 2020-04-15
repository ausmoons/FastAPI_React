import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import auth from '../services/auth';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onFinish = this.onFinish.bind(this);
    }


    onFinish(values) {
        const data = {};
        data.username = values.username;
        data.password = values.password;
        fetch("/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson.access_token === undefined)
                if (resJson.access_token === undefined) {
                    message.error('Login was not successful');
                    this.props.history.push("/");
                }
                else {
                    localStorage.setItem("token", resJson.access_token);
                    auth.login(() => {
                        this.props.history.push("/all");
                    })
                }

            })
            .catch(err => console.log(err));
    }


    render() {
        return (
            <Form
                {...layout}
                name="basic"
                onFinish={this.onFinish}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                   </Button>
                </Form.Item>
            </Form>
        );
    };
}

export default Signin;