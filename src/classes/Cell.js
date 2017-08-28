import React from 'react';

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        console.log(props)
    }

    handleClick = (event) => {
        //console.log("handleClick");
        if(event.shiftKey && !this.props.cell.isOpen){

            this.props.onCellFlagChange(this.props.cell);

        }else if(!this.props.cell.isFlaged && !this.props.cell.isOpen){

            if(this.props.cell.hasMine){

                this.props.onCellExplode(this.props.cell);

            }else{

                this.props.onCellOpen(this.props.cell)
            }
        }
    };

    renderNormal = () => {
        //console.log("Cell.renderNormal");
        console.log("renderNormal");
        console.log(this.props);
        console.log(this.props.cell);
        let isFlaged = this.props.cell.isFlaged;
        let isOpen = this.props.cell.isOpen;
        let hasMine = this.props.cell.hasMine;
        let superman = this.props.superman;
        let cords = " x: " + this.props.cell.id_x + " y: " + this.props.cell.id_y;

        if(hasMine && isOpen){
            return (
                <td className="button_open"
                    onClick= {this.handleClick}>
                         {"*" + cords}
                </td>
            );
        }
        else if(isOpen){
            return (
               <td className="button_open" onClick= {this.handleClick}>
                        {this.props.cell.adjacent + "" + cords}
               </td>
            );
        }else if(isFlaged){
            return (
                <td className="button" onClick= {this.handleClick}>
                    {"Flag" + cords}
                </td>
            );
        }else if(superman && hasMine) {
            return (
                <td className="button" onClick={this.handleClick}>
                        *
                </td>
            );
        } else{
            return (
                <td className="button" onClick= {this.handleClick}>
                    {cords}
                </td>
            )
        }
    };

    renderMineExplode = () => {
      //  console.log("Cell.renderMineExplode");
        return (
            <td className="button" >*</td>
        );
    };


    render() {
        //console.log("gameOver: " + this.props.cell.gameOver);
        if(this.props.cell.gameOver){
            //console.log("renderMineExplode");
            return this.renderMineExplode();

        }
        return this.renderNormal();
    }
}