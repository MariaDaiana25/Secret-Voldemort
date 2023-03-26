import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import match from "./match";
import join_match from "./join_match";
import vote from "./vote";
import init_game from "./init_game";
import define_role from "./define_role";
import list_match from "./list_match";
import data from "./data";
import cards from "./cards";
import proclamation from "./proclamation";
import govermment_role from "./govermment_role";
import state_current from "./state_current";

export default combineReducers({
  auth,
  message,
  match,
  join_match,
  vote,
  init_game,
  list_match,
  data,
  define_role,
  govermment_role,
  cards,
  proclamation,
  state_current
});