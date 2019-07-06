export const ADD_EVENT = "ADD_EVENT";
export const INCREMENT_EVENT_INDEX = "INCREMENT_EVENT_INDEX";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export function addEvent(eventInfo) {
    return {
        type: ADD_EVENT,
        payload: eventInfo
    }
}

export function incrementEventIndex() {
    return {
        type: INCREMENT_EVENT_INDEX,
    }
}

export function updateEvent(eventInfo) {
    return {
        type: UPDATE_EVENT,
        payload: eventInfo
    }
}

export function deleteEvent(eventInfo) {
    return {
        type: DELETE_EVENT,
        payload: eventInfo
    }
}