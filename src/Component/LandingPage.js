import React, {Component} from "react";
import "../App.css";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import GenerateCharts from "./GenerateCharts";
import Footer from './Footer';
import LoadingPage from "./LoadingPage";
class LandingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            request: {},
            apis: {},
            types: [],
            isLoading: true,
            requestedType: "Kharif-Crop",
            viewType: "pie",    
            sendData: new Set(),
            sideBarView:true
        }
        this.preProcessAndLoadTheData = this.preProcessAndLoadTheData.bind(this)
        this.handleClickForProductType = this.handleClickForProductType.bind(this)
        this.handleClickForToggleView = this.handleClickForToggleView.bind(this)
        this.handleSideBarForPopUp = this.handleSideBarForPopUp.bind(this)

    

    }   

    async componentDidMount() {
        this.setState({
            apis: await require('./Apis.json')
        }, () => this.preProcessAndLoadTheData())

    }

    async preProcessAndLoadTheData() {
        let typesTemp = []

        for (let key in this.state.apis)
            typesTemp.push(key)

        let receivedResponse = {}
        let id = "Kharif-Crop"
        const url = this.state.apis[id]

        let response = await fetch("/API" + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let status = response.status;
        if (status === 200) {
            receivedResponse = await response.json()
        } else {
            console.log("Error during api call")
        }

        this.setState({
            request: receivedResponse,
            requestedType: id,
            isLoading: false,
            types: typesTemp
        })
    }

    async handleClickForProductType(event) {
        const id = event.target.id
        console.log("this ",id);
        const url = this.state.apis[id]
        let receivedResponse = {}

        //Load requested Data
        let response = await fetch("/API" + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        let status = response.status;
        if (status === 200) {
            receivedResponse = await response.json()
        } else {
            console.log("Error during api call")
        }

        this.setState({
            request: receivedResponse,
            requestedType: id
        })
    }

    tableRowStatesHandleClick(event) {
        const id = event.target.id;
        console.log(id);

        let presentStates = this.state.statesForLineChart;
        if (presentStates.includes(id)) presentStates.splice(presentStates.indexOf(id), 1);
        else {
            if (presentStates.length === 3) presentStates.shift();
            presentStates.push(id);
        }
        this.setState({
            statesForLineChart: presentStates
        }, () => this.createChart())
    }
    handleClickForToggleView(event) {
        const id = event.target.id
        console.log(id);
        this.setState({
            viewType: id
    
        })
    }

    handleSideBarForPopUp(){
        const prevSideBarView = this.state.sideBarView;
        this.setState(prevState=>({
            ...prevState,
            sideBarView: !prevSideBarView
        }))
    }

    render() {
            /* <LandingPage changeState={state}/> */
        // console.log(this)
        if(this.props.location.state!==undefined)
        {
            this.state.sendData.add(this.props.location.state.mapStates);
        }
        
        if (this.state.isLoading) {
            
            return (
                
                <LoadingPage/>
                
            )
        }

        return (
            
            <div className="LandingPage">

                {console.log("R",this) }
                <NavBar
                    toggleViewHandler={this.handleClickForToggleView}
                    // onClick={() =>   console.log(selectedState)}                    
                    sideBarHandler={this.handleSideBarForPopUp}
                    dataset={this.state.request}/>

                {this.state.sideBarView?
                <SideBar
                    types={this.state.types}
                    handler={this.handleClickForProductType}
                    />:""}

                <GenerateCharts
                    moveToGenChart= {this.state.sendData}
                    dataset={this.state.request}
                    name={this.state.requestedType}
                    viewType={this.state.viewType}
                />

                <Footer/>
            </div>
        )
    }

}

export default LandingPage