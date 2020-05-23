import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => (dispath) => {
  const id = uuidv4();
  dispath({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispath({ type: REMOVE_ALERT, payload: id }), timeout);
};
