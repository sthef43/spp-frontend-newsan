import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import DateTimePicker from "react-datetime-picker";
import "./modal.css";
import moment from "moment";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { calendarSlice } from "app/Middleware/reducers/calendarSlice";
//import { uiSlice } from "app/Middleware/reducers/uiSlice";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

Modal.setAppElement("#root");

const startDate = moment().minutes(0).seconds(0).add(1, "hours");
const endDate = moment().minutes(0).seconds(0).add(5, "hours");

const initEvent = {
  title: "Cumpleaños del jefe",
  start: moment().toDate(),
  end: moment().add(2, "hours").toDate(),
  bgcolor: "#fafafa",
  user: {
    _id: "123",
    name: "Eze"
  },
  notes: "comprar pastel"
};

export const CalendarModal = () => {
  const dispatch = useAppDispatch();
  //const { modalOpen } = useAppSelector((state) => state.ui);

  const { activeEvent } = useAppSelector((state) => state.calendar);

  const [startState, onChangeInicial] = useState(startDate.toDate());
  const [endState, onChangeEnd] = useState(endDate.toDate());
  const [valid, setvalid] = useState(true);
  const [formValue, setFormValue] = useState(initEvent);

  useEffect(() => {
    if (activeEvent) {
      setFormValue(activeEvent);
    }
  }, [activeEvent]);

  const changeStartDate = (e: any) => {
    onChangeInicial(e);
    handleInputChange({ target: { value: e, name: "start" } });
  };
  const changeEndDate = (e: any) => {
    onChangeEnd(e);
    handleInputChange({ target: { value: e, name: "end" } });
  };

  /*const [isOpen, setisOpen] = useState(true)    
    const closeModal =()=>{
        setisOpen(false);
    }*/
  const { title, notes, start, end } = formValue;

  const handleInputChange = ({ target }: any) => {
    setFormValue({
      ...formValue,
      [target.name]: target.value
    });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const momentStart = moment(start);
    const momentEnd = moment(end);
    if (momentStart.isSameOrAfter(momentEnd)) {
      Swal.fire("Error", "la fecha esta mal", "error");
      return;
    }
    if (title.trim().length < 2) {
      setvalid(false);
      return;
    }
    dispatch(
      calendarSlice.actions.addNew({
        ...formValue,
        id: new Date().getTime()
      })
    );

    setvalid(true);
    closeModal();
  };
  const closeModal = () => {
    //dispatch(uiSlice.actions.uiCloseModal());
    //appUseDispatch
    setFormValue(initEvent);
  };

  return (
    <Modal
      isOpen={true}
      //  onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      closeTimeoutMS={200}
      style={customStyles}
      className="modal filter invert"
      overlayClassName="modal-fondo">
      <h3 className="text-3x1"> Nuevo evento </h3>
      <hr />
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker onChange={changeStartDate} value={startState} maxDate={endState} className="form-control" />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker onChange={changeEndDate} value={endState} minDate={startState} className="form-control" />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control${!valid && "is-invalid"}`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            className="form-control"
            placeholder="Notas"
            rows={5}
            name="notes"
            value={notes}
            onChange={handleInputChange}></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-primary btn-block filter invert">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
