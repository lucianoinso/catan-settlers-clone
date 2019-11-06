import countResources from "./utils";
import axios from "axios";
import PopupController from "../../PopupController/PopupController.jsx";
import apiURL from "../../api";

// Action types

const SAVE_RESOURCE = "save_resource";
const OFFER_BANK = "offer_bank";
const REQUEST_BANK = "request_bank";

//Reducer

const initialState = {
    brickAmount: 0,
    woolAmount: 0,
    grainAmount: 0,
    lumberAmount: 0,
    oreAmount: 0
};

const resourcesReducer = (state = initialState, action) => {
    let trade = { ...state };
    switch (action.type) {
        case SAVE_RESOURCE:
            return {
                ...state,
                brickAmount: action.payload.brickAmount,
                woolAmount: action.payload.woolAmount,
                grainAmount: action.payload.grainAmount,
                lumberAmount: action.payload.lumberAmount,
                oreAmount: action.payload.oreAmount
            };
        case OFFER_BANK:
            trade[`${action.payload}Amount`] = trade[`${action.payload}Amount`] - 4;
            return trade;
        case REQUEST_BANK:
            trade[`${action.payload}Amount`] = trade[`${action.payload}Amount`] + 1;
            return trade;
        default:
            return state;
    }
};

//Action creators

const saveResource = (payload, dispatch) => {
    const id = 1;
    axios
        .get(`${apiURL}/games/${id}/player`)
        .then(response => {
            const countedResources = countResources(response.data.resources);
            payload = countedResources;
            dispatch({
                type: SAVE_RESOURCE,
                payload
            });
        })
        .catch(err => {
            PopupController.pushError({
                content: `Hubo un error al conectarse con el servidor.`
            });
            console.error(err);
        });
};

const offerBank = (payload, dispatch) => {
    dispatch({
        type: OFFER_BANK,
        payload
    });
};

const requestBank = (payload, dispatch) => {
    dispatch({
        type: REQUEST_BANK,
        payload
    });
};
//Maps

const mapStateToProps = state => {
    return {
        brickAmount: state.game.resources.brickAmount,
        woolAmount: state.game.resources.woolAmount,
        grainAmount: state.game.resources.grainAmount,
        lumberAmount: state.game.resources.lumberAmount,
        oreAmount: state.game.resources.oreAmount
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveResource: payload => saveResource(payload, dispatch)
    };
};

export {
    resourcesReducer,
    mapStateToProps,
    mapDispatchToProps,
    offerBank,
    saveResource as updateResources,
    requestBank
};
