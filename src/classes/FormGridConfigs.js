import React from 'react';

export default class FormGridConfigs extends React.PureComponent {

    constructor(props) {
        super(props);
        console.log("NameForm constructor");
        this.state =  {
            isSuperMa: true,
            height: 10,
            width: 9,
            mines: 8,
        };
    }

    handleWidth = (event) => {
        let _width = event.target.value;
        this.setState({
            width: parseInt(_width, 10)
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

    handleSuperMan = (event) => {
        let _superMan = event.target.checked;
        console.log(_superMan);
        this.setState({
            isSuperMan: _superMan
        });
        this.props.notifySuperManStateChange(_superMan);
    };

    handleSubmit = () => {
        this.props.initGame(this.state.height, this.state.width , this.state.mines);
    };

    render() {
        return (
            <div>
            <form>
                <label>
                    Superman:
                    <input
                        name="isSuperMan"
                        type="checkbox"
                        checked={this.state.isSuperMan || false}
                        onChange={this.handleSuperMan} />
                </label>
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

            </form>
                <button onClick= {this.handleSubmit}> New game</button>
            </div>
        );
    }
}