import { ADD_EVENT, INCREMENT_EVENT_INDEX, UPDATE_EVENT, DELETE_EVENT } from "../actions/eventActions"

const initialState = { 
	events: [],
	eventIndex: 1
} 

const eventsReducer = (state = initialState, action) => {
	switch(action.type) {
		case ADD_EVENT: {
			return {
				...state, events: [...state.events, action.payload ]
			}
		}
		case INCREMENT_EVENT_INDEX: {
			return {
				...state, eventIndex: state.eventIndex + 1
			}
		}
		case UPDATE_EVENT: {
			return {
				...state, 
				events: state.events.map(
					(event) => event.index === action.payload.index ? 
						{...event, start: action.payload.start, end: action.payload.end, title: action.payload.title, state: action.payload.state}
						: event
				)
			}
		}
		case DELETE_EVENT: {
			return {
				...state, 
				events: state.events.filter(
					((event) => event.index !== action.payload)
				)
			}
		}
		default:
		return state
	}
}   

export default eventsReducer;
