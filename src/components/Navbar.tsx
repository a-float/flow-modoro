import { Icon, Menu, MenuItem } from "semantic-ui-react";

const Navbar = () => {
  return (
    <Menu>
      <MenuItem name="tasks">
        <Icon name="tasks" />
      </MenuItem>
      <MenuItem name="settings" position="right">
        <Icon name="cog" />
      </MenuItem>
    </Menu>
  );
};

export default Navbar;
