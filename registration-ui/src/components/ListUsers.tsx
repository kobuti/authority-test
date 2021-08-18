import { FC } from 'react';
import PropTypes from 'prop-types';

interface Props {
  userToken: string
}

const ListUsers: FC<Props> = () => {
  return(
    <h2>List Users</h2>
  );
}

ListUsers.propTypes = {
  userToken: PropTypes.string.isRequired
}

export default ListUsers;