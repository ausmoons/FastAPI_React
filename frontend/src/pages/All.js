import React, { Component } from "react";
import auth from '../services/auth';
import { Table, Form, Input, Button, Select, message } from 'antd';
import 'antd/dist/antd.css';


const { Option } = Select;


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



const onSubmit = values => {
    console.log(values);
};

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select
            style={{
                width: 70,
            }}
        >
            <Option value="371">+371</Option>
        </Select>
    </Form.Item>
);

export default class All extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            loading: true,
        };
        this.fetchData = this.fetchData.bind(this);
        this.postData = this.postData.bind(this);
    }

    fetchData = () => {
        fetch("/contacts", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ contacts: responseJson });
                this.setState({ loading: false })
            })

            .catch(err => console.log(err));
    };

    postData(values) {
        const data = {};
        data.fullName = values.fullName;
        data.country = values.country;
        data.phone = values.phone;
        data.email = values.email;
        fetch("/contacts", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(data)
        })
            .catch(err => console.log(err))
        console.log(JSON.stringify(data))
        message.success('You added a new contact');
        this.fetchData();

    }

    onClick(id) {
        fetch('/contacts/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        this.fetchData();
        message.success('You deleted a contact');
    }


    componentDidMount() {
        this.fetchData();
    }


    render() {
        const columns = [
            {
                title: "Full Name",
                dataIndex: "fullName",
                key: "fullName"
            },
            {
                title: "Country",
                dataIndex: "country",
                key: "country"
            },
            {
                title: "Phone",
                dataIndex: "phone",
                key: "phone"
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email"
            },
            {
                title: "Delete contact",
                key: "action",
                render: (contacts) => (
                    <span>
                        <Button onClick={() => this.onClick(contacts.id)}>Delete</Button>
                    </span>
                ),
            }
        ];

        return (
            <div>
                <Button
                    onClick={() => {
                        auth.logout(() => {
                            this.props.history.push("/");
                        });
                    }}
                >
                    Logout
            </Button>

                <Form {...layout} name="control-hooks" onFinish={this.postData}>
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                            },
                        ]}
                    >
                        <Input
                            addonBefore={prefixSelector}
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" onClick={onSubmit}>
                            Submit
                   </Button>
                    </Form.Item>
                </Form>



                <Table columns={columns} dataSource={this.state.contacts} />




            </div >
        );
    }
}


