import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Cards from "../services/cards.service";
import Modal from 'react-modal';
import Swal from 'sweetalert2';

import "./css/Vote.css";

const DiscardMM = (props) => {

    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);
 
    const { player: currentMatchPlayerOne } = useSelector((state) => state.match);
    const { player: currentMatchPlayer } = useSelector((state) => state.join_match);

    const [ isOpenModal, setisOpenModal ] = useState(false);
    const [card, setCard] = useState(0);
    const [OK, setOK] = useState(true);
    const [card1, setcard1] = useState({});
    const [card2, setcard2] = useState({});
    const [card3, setcard3] = useState({});

    const onChangeCards = (e) => {
        const position_deck = e.target.value;
        setCard(position_deck);
        setOK(false);
      };

    const handleCardDiscard = () => {
      if(isMatchIn) {
        Cards.discard_cards(currentMatchPlayerOne.name_match, card, props.namePlayer);
        setisOpenModal(false);
      }
      if(isJoinMatchIn) {
        Cards.discard_cards(currentMatchPlayer.name_match, card, props.namePlayer);
        setisOpenModal(false);
      }
    };

    const HandleTakesCards = () => {
      if(isMatchIn) {
        Cards.take_cards_MM(currentMatchPlayerOne.name_match, props.positionPlayer).then(
          (data) => {
            setcard1(data.list_card[0]);
            setcard2(data.list_card[1]);
            setcard3(data.list_card[2]);
            setisOpenModal(true);
          }, (error) => {
            Swal.fire({title:error.toString(), background:"#000000f5"});
          }
        );
      };
      if(isJoinMatchIn) {
        Cards.take_cards_MM(currentMatchPlayer.name_match, props.positionPlayer).then(
          (data) => {
            setcard1(data.list_card[0]);
            setcard2(data.list_card[1]);
            setcard3(data.list_card[2]);
            setisOpenModal(true);
          }, (error) => {
            Swal.fire({title:error.toString(), background:"#000000f5"});
          }
        );
      };
    };

    const HandleIsMagicMinister = () => {
      if(Array.isArray(props.Players) && props.Players.length) {
        let player = props.Players.filter((player) =>
                        "MagicMinister" === player.govermment_role);
        return(props.namePlayer === player[0].nickname);
      } else {
          return false;
      };
    };

    return (
        <div>
            {
            (HandleIsMagicMinister()) ?
            <button className= "vote-validate" onClick={() => {HandleTakesCards()}}>Discard Card</button>
            :
            <h4 className="vote-wait">Waiting for the Minister Proclame a Card</h4>
            }
          <Modal
            isOpen={isOpenModal}
            shouldCloseOnOverlayClick={false}
            onRequestClose={()=>setisOpenModal(false)}
            id = "modal-candidates"
            style={
                {
                overlay:{
                    backgroundColor:'black',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                content:{
                    color: 'black',
                    backgroundColor:'grey'
                }
                }
            }>
            <div>
              <div className="radio-buttons">
                {card1.proclamation}
                <input
                    id={card1.position_deck}
                    value={card1.position_deck}
                    name="cards"
                    type="radio"
                    onChange={onChangeCards}
                />
                {card2.proclamation}
                <input
                    id={card2.position_deck}
                    value={card2.position_deck}
                    name="cards"
                    type="radio"
                    onChange={onChangeCards}
                />
                {card3.proclamation}
                <input
                    id={card3.position_deck}
                    value={card3.position_deck}
                    name="cards"
                    type="radio"
                    onChange={onChangeCards}
                />
              </div>
              <div>
                <button onClick={() => {handleCardDiscard()}} className="btn btn-primary btn-block" disabled={OK}>
                    Discard
                </button>        
              </div>
                <button onClick={() => setisOpenModal(false)}> Close </button>
            </div>
          </Modal>
        </div>
    )
};

export default DiscardMM;