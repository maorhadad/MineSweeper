import React from 'react';

export default class FormGridConfigs extends React.Component {

    constructor(props) {
        super(props);
        console.log("NameForm constructor");
        this.state = {
            width: 10,
            height: 9,
            mines: 8,
        };
    }


    componentWillUpdate(){
        console.log("FormGridConfigs componentWillUpdate");
    }

    componentDidUpdate (){
        console.log("FormGridConfigs componentDidUpdate ");
    }


    componentDidMount(){
        console.log("FormGridConfigs componentDidMount");
    }

    handleWidth = (event) => {
        let _width = event.target.value;
        this.setState({
            height: parseInt(_width, 10)
        });
    };

    handleHeight = (event) => {
        let _height = event.target.value;
        this.setState({
            height: parseInt(_height, 10)
        });
    };

    handleMines = (event) => {
        let _mines = event.target.value;

        this.setState({
            mines: parseInt(_mines, 10)
        });
    };

    handleSubmit = () => {
        this.props.initGame();
    };

    getFormInputs = () =>{
        console.log("NameForm getFormInputs");
        return {
            width : this.state.width,
            height : this.state.height,
            mines : this.state.mines,
        };
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Width:
                    <input type="number" value={this.state.width} onChange={this.handleWidth} />
                </label>
                <label>
                    Height:
                    <input type="number" value={this.state.height} onChange={this.handleHeight} />
                </label>
                <label>
                    Mines:
                    <input type="number" value={this.state.mines} onChange={this.handleMines} />
                </label>
                <br/>
                <input type="submit" value="NEW GAME" />
            </form>
        );
    }
}