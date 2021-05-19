import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button, Icon, Box, Checkbox } from "@material-ui/core";

const useStyles = makeStyles({
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
});

const Todos = ({
  todoItem,
  toggleTodoCompleted,
  deleteTodo,
  provided,
  style,
}) => {
  const classes = useStyles();
  const { id, text, completed } = todoItem;
  const { innerRef, draggableProps, dragHandleProps } = provided;
  return (
    <Box
      key={id}
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      display="flex"
      flexDirection="row"
      alignItems="center"
      className={classes.todoContainer}
      style={style}
    >
      <Checkbox checked={completed} onChange={() => toggleTodoCompleted(id)} />
      <Box flexGrow={1}>
        <Typography
          className={completed ? classes.todoTextCompleted : ""}
          variant="body1"
        >
          {text}
        </Typography>
      </Box>
      <Button
        className={classes.deleteTodo}
        startIcon={<Icon>delete</Icon>}
        onClick={() => deleteTodo(id)}
      >
        Delete
      </Button>
    </Box>
  );
};

export default Todos;
