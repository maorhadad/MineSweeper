import React from 'react';

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            superman : false,
            hasMine: props.cell.hasMine,
            isFlaged: props.cell.isFlaged,
            isOpen : props.cell.isOpen,
            id_y : props.cell.id_y,
            id_x : props.cell.id_x,
            adjacent : props.cell.adjacent,
        };
    }

    handleClick = (event) => {
        //console.log("handleClick");
        if(event.shiftKey && !this.state.isOpen){

            this.props.onCellFlagChange(this.props.cell);

        }else if(!this.state.isFlaged && !this.state.isOpen){

            if(this.state.hasMine){

                this.props.onCellExplode(this.props.cell);

            }else{

                this.props.onCellOpen(this.props.cell)
            }
        }
    };

    renderSuperman = () => {
        if(this.state.hasMine){
            return (
                <td className="button" onClick= {this.handleClick}>
                    <h10>*</h10>
                    <h10>{this.state.adjacent + ""}</h10><br/>


                </td>

            );
        }else{
            return (
                <td className="button" onClick= {this.handleClick}>
                    <h10>{this.state.adjacent + ""}</h10>
                </td>

            );
        }
    };

    setOpen = (_isOpen)=>{
        if(_isOpen === this.state.isOpen){
            return
        }
        this.setState({
            isOpen:_isOpen
        });
    };

    setSuperMan = (_isSuperMan)=>{
        if(_isSuperMan === this.state.isSuperMan){
            return
        }
        console.log("_isSuperMan: " + _isSuperMan);
        this.setState({
            superman:_isSuperMan
        });
    };

    setFlaged = (_isFlaged)=>{
        if(_isFlaged === this.state.isFlaged){
            return
        }
        this.setState({
            isFlaged:_isFlaged
        });
    };

    renderNormal = () => {
        //console.log("Cell.renderNormal");
        let isFlaged = this.state.isFlaged;
        let isOpen = this.state.isOpen;
        let hasMine = this.state.hasMine;
        let superman = this.state.superman;
        let cords = " x: " + this.state.id_x + " y: " + this.state.id_y;
        if( (1 === this.state.id_x && 28 === this.state.id_y ) || (0 === this.state.id_x && 0 === this.state.id_y) ){
            console.log("Rendering it with state: " + this.state.id_x + " " + this.state.id_y + " " + isOpen);
        }
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
                        {this.state.adjacent + "" + cords}
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
        //console.log("gameOver: " + this.state.gameOver);
        if(this.state.gameOver){
            //console.log("renderMineExplode");
            return this.renderMineExplode();

        }
        return this.renderNormal();
    }
}