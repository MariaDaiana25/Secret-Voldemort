import React, {useState} from 'react';
import { useSelector } from "react-redux";
import SpellServices from "../services/spell.services";
import Modal from 'react-modal';

import "./css/Vote.css";

const Avada = (props) => {

    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);

    const { player: currentMatchPlayerOne } = useSelector((state) => state.match);
    const { player: currentMatchPlayer } = useSelector((state) => state.join_match);

    const [ isOpenModal, setisOpenModal ] = useState(false);

    const handlekill = (e, nickname, position_player) => {
        e.preventDefault();
        if(isMatchIn) {
            SpellServices.spell_kill(currentMatchPlayerOne.name_match, nickname, position_player);
        };
        if(isJoinMatchIn) {
            SpellServices.spell_kill(currentMatchPlayer.name_match, nickname, position_player);
        };
    };

    const HandleIsMagicMinister = () => {
        if(Array.isArray(props.Players) && props.Players.length) {
          let player = props.Players.filter((player) =>
                          "MagicMinister" === player.govermment_role);
            if(player[0] === undefined) {
                return false;
            } else {
                return(props.namePlayer === player[0].nickname);
            }
        } else {
            return false;
        };
      };

    return (
        <div>
            {
            (HandleIsMagicMinister()) ?
            <div>
                <button className="vote-validate" onClick={() => setisOpenModal(true)}>Kill Sorcerer</button>
            </div>
            :
            <h4 className="vote-wait">Waiting for the Minister throw the Spell </h4>
            }            
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
                <h5>Kill to One Sorcerer</h5>
            </div>
            {
                (Array.isArray(props.Players) && props.Players.length) ?
                props.Players.map((player, index) => {
                    if(props.namePlayer !== player.nickname){

                        return (
                            <button
                            key={index}
                            className="button-kill"
                            onClick={(e) => {handlekill(e, player.nickname, player.position_player)}}
                            >
                                {player.nickname}
                            </button>
                        )
                    } else {
                        return null
                    }
                })
                : null
            }
            <div>
                <button className="close-modal-showmatch" onClick={() => setisOpenModal(false)}> Close </button>
            </div>
            </Modal>
        </div>
    )
};

export default Avada;