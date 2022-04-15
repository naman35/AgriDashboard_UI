import React, { Component } from "react";
import "../App.css";
import v1 from "../images/V1.PNG";
import v2 from "../images/V2.PNG";
import v3 from "../images/V3.PNG";
import e1 from "../images/E1.PNG";
import e2 from "../images/E2.PNG";
import e3 from "../images/E3.PNG";
import e4 from "../images/E4.PNG";
import nitiLogo from "../images/NITI-Aayog-logo.png"
import { withRouter } from "react-router-dom";
import IndiaMapPopup from "./IndiaMapPopup";
import Popup from "./Popup";

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleViewHandler: props.toggleViewHandler,
            dataset: props.dataset,
            id: "pie",
            popUpTrigger: false,
            registerPopUpTrigger: false,
            sideBarHandler: props.sideBarHandler
        }

        this.handleClickLeft = this.handleClickLeft.bind(this);
        this.handlePopUp = this.handlePopUp.bind(this);
        this.handlerRegisterPopUp = this.handlerRegisterPopUp.bind(this);
        this.summaryButtonHandler = this.summaryButtonHandler.bind(this);

    }

    summaryButtonHandler() {
        this.props.history.push({
            pathname: '/Summary'
        }
        )
    }

    handleClickLeft(event) {
        const id = event.target.id

        this.setState({
            id: id
        }, () => this.state.toggleViewHandler(event))
    }

    handlePopUp() {
        //console.log("called"));
        const prevTrigger = this.state.popUpTrigger;
        this.setState(prevState => ({
            ...prevState,
            popUpTrigger: !prevTrigger
        }))

        this.state.sideBarHandler();
    }
    handlePopUpF=()=> {
        console.log("calleddddddddddddddd")
        console.log("OPEN",this.state.popUpTrigger);
        const prevTrigger = this.state.popUpTrigger;

        this.setState(prevState => ({
            ...prevState,
            popUpTrigger: !prevTrigger,
            registerPopUpTrigger: false          
        }))
        this.state.sideBarHandler();
    }


    handlerRegisterPopUp(){
        console.log(this.state.registerPopUpTrigger);
        const regTrigger = this.state.registerPopUpTrigger;
        this.setState(prevState => ({
            ...prevState,
            registerPopUpTrigger: !regTrigger
        }))
        this.state.sideBarHandler();
    }

    render() {
        return (
            <div className="NavBar hover">
                <nav>
                    <label className="LeftLabel">
                        <ul>
                            <h3><i>Toggle View</i></h3>
                            <li>
                                <figure>
                                    <img
                                        style={{
                                            transform: this.state.id === "line" ? "scale(1.2)" : "scale(0.9)"
                                        }}
                                        onClick={this.handleClickLeft} id="line" src={v1} alt="" />
                                </figure>
                            </li>
                            <li>
                                <img src={v3} alt="" />
                            </li>
                            <li>
                                <figure>
                                    <img
                                        style={{ transform: this.state.id === "pie" ? "scale(1.2)" : "scale(0.9)" }}
                                        onClick={this.handleClickLeft} id="pie" src={v2} alt="" />
                                </figure>
                            </li>
                        </ul>
                    </label>
                    <label className="logo"> <img src={nitiLogo} style={{
                        height: "95px",
                        marginLeft:"50px"



                    }} /></label>
                    {/*<label className="logo">Niti Aayog Dashboard</label>*/}
                    <label className="RightLabel">
                        <ul>
                            <br/>
                            <li>
                                <figure>
                                    <img style={{ paddingLeft: "15px" }} src={e1} alt=""
                                        onClick={this.summaryButtonHandler} />
                                </figure>
                            </li>
                            <li>
                                <figure>
                                    <img style={{ paddingLeft: "15px"}} src={e2} alt="" />
                                </figure>
                            </li>
                            <li>

                                {/*<Link to="/IndiaMap" target="_blank"><img style={{paddingLeft: "15px"}} src={e3}*/}
                                {/*                                          alt=""/></Link>*/}
                                <figure>
                                <button style={{ border: "20px" }} onClick={this.handlePopUp}>
                                    <img style={{ paddingLeft: "15px" }} src={e3} alt="" />
                                </button>
                                <IndiaMapPopup trigger={this.state.popUpTrigger}>
                                </IndiaMapPopup></figure>

                            </li>
                            <li>
                                <figure>
                                <button style={{ border: "0px" }} onClick={this.handlerRegisterPopUp}>
                                    <img style={{ paddingLeft: "15px" }} src={e4} alt="" />
                                </button>
                                    <Popup trigger={this.state.registerPopUpTrigger}>
                                    </Popup>
                                    </figure>
                                    
                            </li>
                        </ul>
                    </label>
                </nav>
            </div>
        )
    }
}

export default withRouter(NavBar);