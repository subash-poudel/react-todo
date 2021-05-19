import { useMemo, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon, Paper, Box, TextField } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { format, getDateConfiguration, YYYY_MM_DD } from "../../utils/dateUtil";

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
});

const TodoInputField = ({ newTodoText, setNewTodoText, addTodo }) => {
  const classes = useStyles();
  const { minDate, maxDate, defaultDate } = useMemo(getDateConfiguration, []);
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const handleDateChange = (date) => {
    const formattedDate = format(date, YYYY_MM_DD);
    setSelectedDate(formattedDate);
  };

  const handleAddTodoClick = () => {
    if (newTodoText) {
      addTodo({ text: newTodoText, date: selectedDate });
    }
  };

  return (
    <Paper className={classes.addTodoContainer}>
      <Box display="flex" flexDirection="row">
        <Box flexGrow={1}>
          <TextField
            fullWidth
            value={newTodoText}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleAddTodoClick();
              }
            }}
            onChange={(event) => setNewTodoText(event.target.value)}
          />
        </Box>
        <Button
          className={classes.addTodoButton}
          startIcon={<Icon>add</Icon>}
          onClick={handleAddTodoClick}
          data-cy="add-todo-button"
        >
          Add
        </Button>
      </Box>
      <Box>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="yyyy-MM-dd"
            margin="normal"
            minDate={minDate}
            maxDate={maxDate}
            label="Todo Due Date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "Todo Due Date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Box>
    </Paper>
  );
};

export default TodoInputField;
