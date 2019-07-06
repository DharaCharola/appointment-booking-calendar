import React, { Component } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import {Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { addEvent, incrementEventIndex, updateEvent, deleteEvent } from "../../store/actions/eventActions"
import 'react-datetime/css/react-datetime.css'
const DateTime = require('react-datetime');
const localizer = BigCalendar.momentLocalizer(moment);

class TrackEvents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: {
        index: "",
        title: "",
        state: "",
        start: moment().toDate(),
        end: moment().toDate(),
      },
      showModal: false,
      isEdit: false,
      showError: false
    };
    this.selectedDate = "";
    this.eventPointer = "";
  }

  // Handle form data
  handleEventDataChanges = (e) => {
    this.setState({
      event: {
        ...this.state.event, [e.target.name] : e.target.value
      }
    })
  }

  validateData = () => {

    const {event} = this.state;

    if(event.title === "" || event.title.length > 20 || event.start === "" || event.end === "" || event.state === "") {
      return true;
    } 

    return false;
  }

  // Displays event with style on calender
  eventRender = ({ event }) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "12px" }}>
          <span style={{ color: "#fff" }}>
            {event.title} ({event.state})
          </span><br/>
        </div> 
      </div>
    )
  };

  // Handling click event for each event
  handleEventSelection = (index) => {

    let pickedEvnent = this.props.events.find((eachEvent) => (eachEvent.index === index));
    this.eventPointer = index;
    this.setState({
      event: pickedEvnent,
      showModal: true,
      isEdit: true
    });
  }

  // Handling click event for each slot
  handleSlotSelection = (info) => {
    this.selectedDate = moment(info.start).format('DD/MM/YYYY');
    this.setState({
      isEdit: false,
      event: {
        index: "",
        title: "",
        state: "",
        start: moment(`${this.selectedDate} ${moment().format("hh:mm A")}`, 'DD/MM/YYYY hh:mm A').toDate(),
        end:  moment(`${this.selectedDate} ${moment().format("hh:mm A")}`, 'DD/MM/YYYY hh:mm A').toDate(),
      },
      showModal: true,
    });
  }

  // Handling modal close event
  handleModalClose = () => {
    this.clearState()
    this.selectedDate = "";
    this.eventPointer = "";
  }

  manageEvent = () => {
    if (!this.validateData()) {
      if (this.state.isEdit) {
        this.updateEvent();
      }  else {
        this.addEvent();
      }
    } else {
      this.setState({showError: true});
    }
  }

  addEvent = () => {
    let eventData = this.state.event;
    eventData.index = this.props.eventIndex + 1;
    this.props.addEvent(eventData);
    this.props.incrementEventIndex();
    this.clearState();
    this.selectedDate = "";
  }

  updateEvent = () => {
    this.props.updateEvent(this.state.event);
    this.clearState()
  }

  deleteEvent = () => {
    this.props.deleteEvent(this.eventPointer);
    this.clearState();
    this.selectedDate = "";
  }

  clearState = () => {
    this.setState({
      event: {
        index: "",
        title: "",
        state: "",
        start: moment().toDate(),
        end: moment().toDate(),
      },
      showModal: false,
      isEdit: false,
      showError: false
    })
  }
  
  render() {

    const { events } = this.props;
    const { showModal, isEdit, showError, event } = this.state;

    return (
      <>
        <div className="container">
          <div className="row">
            {/* Calendar Start*/}
            <div className="col-md-12">
              <BigCalendar
                localizer={localizer}
                events={events}
                messages={{ next: "next month", previous: "previous month" }}
                defaultView={'month'}
                views={['month', 'day']}
                showMultiDayTimes
                selectable={true}
                defaultDate={moment().toDate()}
                style={{ "height": "635px" }}
                startAccessor='start'
                endAccessor='end'
                components={{
                  event: this.eventRender,
                }}
                onSelectEvent={({ index }) =>  this.handleEventSelection(index)}
                onSelectSlot={(info) => {
                  this.handleSlotSelection(info)
                }}
              />
            </div>
            {/* Calendar Start*/}
          </div>
        </div>
        
        {/* Event Modal start*/}
        <Modal show={showModal} onHide={this.handleModalClose} >
          <Modal.Header closeButton>
            <Modal.Title>{ isEdit ? 'Edit Event' : 'Add Event'}</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            { showError &&
              <div className="alert alert-danger">
                <strong>Danger!</strong> Please Enter valid Data.
              </div>
            }

            <form>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Event:</label>
                <div className="col-sm-8">
                  <input className="form-control" value={event.title} name="title" type="text" placeholder="Event Name" onChange={this.handleEventDataChanges}/>
                </div> 
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">State:</label>
                <div className="col-sm-8">
                  <select className="form-control" name="state" onChange={this.handleEventDataChanges} value={event.state}>
                    <option value="" disabled>Select State</option>
                    <option value="Solo">Solo</option>
                    <option value="Team">Team</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">Start Time:</label>
                <div className="col-sm-8">
                  <DateTime 
                    viewMode="time"
                    inputProps={{readOnly:true}}
                    dateFormat={false}
                    defaultValue={moment(event.start).format("hh:mm A")}
                    onChange={(val) => {

                      let eventDate = this.selectedDate || moment(event.start).format('DD/MM/YYYY');
                      this.setState({
                        event: {
                          ...this.state.event, start : moment(`${eventDate} ${moment(val).format("hh:mm A")}`, 'DD/MM/YYYY hh:mm A').toDate()
                        }
                      })

                    }}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label">End Time:</label>
                <div className="col-sm-8">
                  <DateTime 
                    viewMode="time"
                    inputProps={{readOnly:true}}
                    dateFormat={false}
                    defaultValue={moment(event.end).format("hh:mm A")}
                    onChange={(val) => {

                      let eventDate = this.selectedDate || moment(event.start).format('DD/MM/YYYY');
                      this.setState({
                        event: {
                          ...this.state.event, end: moment(`${eventDate} ${moment(val).format("hh:mm A")}`, 'DD/MM/YYYY hh:mm A').toDate()
                        }
                      })
                      
                    }}
                  />
                </div>
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <button className="button btn-secondary" onClick={this.handleModalClose}>Close</button>
            <button className="button btn-primary" onClick={this.manageEvent}>Save</button>
            {
              isEdit  &&
              <button className="button btn-danger" onClick={this.deleteEvent}>Delete</button>
            }
          </Modal.Footer>
        </Modal>
        {/* Event Modal end*/}
      </>     
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.eventsReducer.events,
    eventIndex: state.eventsReducer.eventIndex,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addEvent: (data) => dispatch(addEvent(data)),
    incrementEventIndex: () => dispatch(incrementEventIndex()),
    updateEvent: (data) => dispatch(updateEvent(data)),
    deleteEvent: (data) => dispatch(deleteEvent(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackEvents);
