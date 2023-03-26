import React, { useState } from 'react';
import { useSelector } from "react-redux";
import SpellServices from "../services/spell.services";
import Modal from 'react-modal';

import Swal from 'sweetalert2';

import "./css/Vote.css";

const Guess = (props) => {

    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);

    const { player: currentMatchPlayerOne } = useSelector((state) => state.match);
    const { player: currentMatchPlayer } = useSelector((state) => state.join_match);

    const [guessThrow, setguessThrow] = useState(false);
    const [ isOpenModal, setisOpenModal ] = useState(false);
    const [listCards, setlistCards] = useState({
        cards: []
    });

    const HandleReady = () => {
        if(isMatchIn) {
            SpellServices.change_state(currentMatchPlayerOne.name_match, 1);
        };
        if(isJoinMatchIn) {
            SpellServices.change_state(currentMatchPlayer.name_match, 1);
        };
    };

    const HandleSpell = () => {
        if(isMatchIn) {
         SpellServices.spell_fortune(currentMatchPlayerOne.name_match, props.namePlayer, props.positionPlayer)
            .then((data) => {
                if(0 === data.codigo) {
                    setlistCards({
                        cards: data.list_card
                    });
                    setisOpenModal(true);
                    setguessThrow(true);
                };
            }, (error) => {
                Swal.fire({title:error.toString(), background:"#000000f5"});
            });
        };
        if(isJoinMatchIn) {
         SpellServices.spell_fortune(currentMatchPlayer.name_match, props.namePlayer, props.positionPlayer)
            .then((data) => {
                if(0 === data.codigo) {
                    setlistCards({
                        cards: data.list_card
                    });
                    setisOpenModal(true);
                    setguessThrow(true);
                };
            }, (error) => {
                Swal.fire({title:error.toString(), background:"#000000f5"});
            });
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
            (guessThrow) ?
            <button className="vote-validate" onClick={() => {HandleReady()}}>Ready to Continue</button>
            :
            (HandleIsMagicMinister()) ?
            <button className="vote-validate" onClick={() => {HandleSpell()}}>Throw Fortune</button>
            :
            <h4 className="vote-wait">Waiting for the Minister throw the Spell</h4>
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
                <h5>Cartas de Proclamaciones</h5>
            </div>
            {
                (Array.isArray(listCards.cards) && listCards.cards.length) ?
                listCards.cards.map((card, index) => {
                    return (
                        <p className="list-candidates" key={index}>
                            {card.proclamation}  {1 + index}
                        </p>
                    )
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

export default Guess;