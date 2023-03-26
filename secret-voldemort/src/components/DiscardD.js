import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Cards from "../services/cards.service";
import Proclamation from "../services/proclamation.services";
import Modal from 'react-modal';
import Swal from 'sweetalert2';

import "./css/Vote.css";


const DiscardD = (props) => {

    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);

    const { player: currentMatchPlayerOne } = useSelector((state) => state.match);
    const { player: currentMatchPlayer } = useSelector((state) => state.join_match);

    const [isOpenModal, setisOpenModal] = useState(false);
    const [card, setCard] = useState(0);
    const [toProclamation, settoProclamation] = useState(0);
    const [OK, setOK] = useState(true);
    const [card1, setcard1] = useState({});
    const [card2, setcard2] = useState({});
    const [readytoProclam, setreadytoProclam] = useState(false);

    const onChangeCards = (e) => {
        const position_deck = e.target.value;
        setCard(position_deck);
        setOK(false);
      };

    const handleProclam = () => {
      if(isMatchIn) {
        Proclamation.proclamation(currentMatchPlayerOne.name_match, toProclamation.position_deck, props.namePlayer);
      };
      if(isJoinMatchIn) {
        Proclamation.proclamation(currentMatchPlayer.name_match, toProclamation.position_deck, props.namePlayer);
      };
    }

    const handleCardDiscard = () => {
      let card_discard = Number(card);
      let card_compare = Number(card1.position_deck);
      if(card_discard === card_compare) {
        settoProclamation(card2);
      } else {
        settoProclamation(card1);
      };
      if(isMatchIn) {
        Cards.discard_cards_D(currentMatchPlayerOne.name_match, card, props.namePlayer);
        setisOpenModal(false);
        setreadytoProclam(true);
      };
      if(isJoinMatchIn) {
        Cards.discard_cards_D(currentMatchPlayer.name_match, card, props.namePlayer);
        setisOpenModal(false);
        setreadytoProclam(true);
      };
    };

    const HandleTakesCards = () => {
      if(isMatchIn) {
        Cards.take_cards_D(currentMatchPlayerOne.name_match, props.positionPlayer, props.gameTurn).then(
          (data) => {
            setcard1(data.list_card[0]);
            setcard2(data.list_card[1]);
            setisOpenModal(true);
          }, (error) => {
            Swal.fire({title:error.toString(), background:"#000000f5"});
          }
        );
      };
      if(isJoinMatchIn) {
        Cards.take_cards_D(currentMatchPlayer.name_match, props.positionPlayer, props.gameTurn).then(
          (data) => {
            setcard1(data.list_card[0]);
            setcard2(data.list_card[1]);
            setisOpenModal(true);
          }, (error) => {
            Swal.fire({title:error.toString(), background:"#000000f5"});
          }
        );
      };
    };

    const HandleIsDirector = () => {
      if(Array.isArray(props.Players) && props.Players.length) {
        let player = props.Players.filter((player) =>
                        "Director" === player.govermment_role);
        return(props.namePlayer === player[0].nickname);
      } else {
          return false;
      };
    };

    return (
        <div>
            {
            (readytoProclam) ?
            <button className="vote-validate" onClick={() => {handleProclam()}}>
              Proclame {toProclamation.proclamation}
            </button>
            :
            (HandleIsDirector()) ?
            <button className="vote-validate" onClick={() => {HandleTakesCards()}}>Discard Card</button>
            :
            <h4 className="vote-wait">Waiting for the Director Proclame a Card</h4>
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
              </div>
              <div>
                <button className="vote-validate" onClick={() => {handleCardDiscard()}} disabled={OK}>
                    Discard
                </button>        
              </div>
                <button onClick={() => setisOpenModal(false)}> Close </button>
            </div>
          </Modal>
        </div>
    )
};

export default DiscardD;