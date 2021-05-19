import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  todoContainer: {
    width: "100%",
    height: "400px",
    marginTop: 20,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const EmptyTodos = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.todoContainer}>
      <Box display="flex" flexDirection="column" alignItems="stretch">
        <Typography variant="body1" data-cy="empty-todos">
          You don't have any todos yet. Let's add and complete them!!!
        </Typography>
      </Box>
    </Paper>
  );
};

export default EmptyTodos;
