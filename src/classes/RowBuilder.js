import React from 'react';
import Cell from './Cell.js'

export default class RowBuilder extends React.Component{
    constructor(props) {
        super(props);
        // console.log("RowBuilder.constructor");
        this.state = {
            cells :  props.cells
        };
    }

    componentWillReceiveProps = (nextProps) => {//https://stackoverflow.com/questions/41233458/react-child-component-not-updating-after-parent-state-change
        console.log("componentWillReceiveProps");
        if(nextProps.cells === this.state.cells){
            return;
        }
        this.setState ( {
            cells :  nextProps.cells
        });
    };

    render() {
        //console.log("RowBuilder.render");
        var Cells = this.state.cells.map((cell, index) => {
            return(

                <Cell
                    key={index}
                    cell={cell}
                    onCellOpend={this.props.onCellOpend}
                    onCellFlagChange={this.props.onCellFlagChange}
                    onCellExplode={this.props.onCellExplode}
                />

            );
        });
        return (
            <tr className="row">
                {Cells}
            </tr>
        );
    }
}