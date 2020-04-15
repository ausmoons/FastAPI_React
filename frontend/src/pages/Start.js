import React from "react";
import { Button } from "antd";



export const Start = props => {
    return (
        <div >
            <text>Please sign in or sign up!</text>
            <Button
                onClick={() => {
                    props.history.push("/signin");
                }}
            >
                Sign in
           </Button>
            <Button
                onClick={() => {
                    props.history.push("/signup");
                }}
            >
                Sign up
             </Button>
        </div>
    );
};


