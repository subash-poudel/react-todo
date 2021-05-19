import DateFnsAdapter from "@date-io/date-fns";
const dateFns = new DateFnsAdapter();

export const YYYY_MM_DD = "yyyy-MM-dd";
const MONTHS_AFTER_TODAY = 3 * 30;

export function getDateConfiguration() {
  const today = new Date();
  const minDate = dateFns.format(today, YYYY_MM_DD);
  const defaultDate = minDate;
  const maxDate = dateFns.format(
    dateFns.addDays(today, MONTHS_AFTER_TODAY),
    YYYY_MM_DD
  );

  return { minDate, defaultDate, maxDate };
}

export function format(date, dateFormat) {
  return dateFns.format(date, dateFormat);
}
