import Handsontable from './../browser';
import moment from 'moment';
import {getNormalizedDate} from '../helpers/date';
import {getEditor} from './../editors';

/**
 * Date cell validator
 *
 * @private
 * @validator DateValidator
 * @dependencies moment
 * @param {*} value - Value of edited cell
 * @param {Function} callback - Callback called with validation result
 */
Handsontable.DateValidator = function(value, callback) {
  let valid = true;
  let dateEditor = getEditor('date', this.instance);

  if (value == null) {
    value = '';
  }
  let isValidDate = moment(new Date(value)).isValid() || moment(value, dateEditor.defaultDateFormat).isValid();
  // is it in the specified format
  let isValidFormat = moment(value, this.dateFormat || dateEditor.defaultDateFormat, true).isValid();

  if (this.allowEmpty && value === '') {
    isValidDate = true;
    isValidFormat = true;
  }
  if (!isValidDate) {
    valid = false;
  }
  if (!isValidDate && isValidFormat) {
    valid = true;
  }

  if (isValidDate && !isValidFormat) {
    if (this.correctFormat === true) { // if format correction is enabled
      let correctedValue = correctFormat(value, this.dateFormat);

      this.instance.setDataAtCell(this.row, this.col, correctedValue, 'dateValidator');
      valid = true;
    } else {
      valid = false;
    }
  }

  callback(valid);
};

/**
 * Format the given string using moment.js' format feature
 *
 * @param {String} value
 * @param {String} dateFormat
 * @returns {String}
 */
let correctFormat = function correctFormat(value, dateFormat) {
  let dateFromDate = moment(getNormalizedDate(value));
  let dateFromMoment = moment(value, dateFormat);
  let isAlphanumeric = value.search(/[A-z]/g) > -1;
  let date;

  if ((dateFromDate.isValid() && dateFromDate.format('x') === dateFromMoment.format('x')) ||
      !dateFromMoment.isValid() ||
      isAlphanumeric) {
    date = dateFromDate;

  } else {
    date = dateFromMoment;
  }

  return date.format(dateFormat);
};

