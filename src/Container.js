import React, { Component } from 'react';


export default class Continer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { children } = this.props
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xl-4 offset-xl-4 ">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}
