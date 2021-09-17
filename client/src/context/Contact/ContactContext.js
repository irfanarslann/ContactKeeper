import { createContext, useReducer } from "react";
import axios from "axios";
import uuid from "uuid";
import ContactReducer from "./ContactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  UPDATE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from "../ActionTypes";

export const ContactContext = createContext();

const ContactContextProvider = ({ children }) => {
  const initialState = {
    contacts: [],
  };

  const [state, dispatch] = useReducer(ContactReducer, initialState);

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactContextProvider;
