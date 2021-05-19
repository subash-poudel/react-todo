import { Typography } from "@material-ui/core";

const Header = ({ title }) => {
  return (
    <Typography variant="h3" component="h1" gutterBottom>
      {title}
    </Typography>
  );
};

export default Header;
