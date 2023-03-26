import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Modal from 'react-modal';


const FinishGame = (props) => {

    const [ isOpenModal, setisOpenModal ] = useState(true);

    return (
        <div>
            <Modal
            isOpen={isOpenModal}
            shouldCloseOnOverlayClick={false}
            onRequestClose={()=>setisOpenModal(false)}
            id = "modal-results-votes"
            style={
                {
                overlay:{
                backgroundColor:"#00000085",
                position:"absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                },
                content:{
                padding:35, 
                width:480,
                height:450,
                top: 100,
                left: 480,
                backgroundColor:'#010014',
                }
                }
            }>
            <div>
                <h5> Winner: {props.winnerGame} </h5>
            </div>
            <div>
                <button className="close-modal-showmatch" onClick={() => setisOpenModal(false)}> Close </button>
            </div>
            </Modal>
        </div>
    )

};

export default FinishGame;