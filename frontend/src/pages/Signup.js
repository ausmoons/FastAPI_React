import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Tooltip,
    Checkbox,
    Button,
    message
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};



class Signup extends Component {
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
        data.name = values.name;


        console.log(data)
        fetch("/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .catch(err => console.log(err));
        message.success('You created an accoun');
        this.props.history.push("/");

    }

    render() {
        return (
            <Form
                {...formItemLayout}
                name="register"
                scrollToFirstError
                onFinish={this.onFinish}
            >
                <Form.Item
                    name="username"
                    label={
                        <span>
                            Username&nbsp;
                             <Tooltip title="What do you want others to call you?">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name"
                    label={
                        <span>
                            Name&nbsp;
                            <Tooltip title="What is your full name?">
                                <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input your full name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        I have read the <a href="https://ant.design/components/form/">agreement</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form >
        );
    };
}


export default Signup;