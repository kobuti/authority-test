import { FC, useState } from 'react';
import PropTypes from 'prop-types';
import { User, UserService } from '../api/user.service';
import DataGrid from './DataGrid';

interface Props {
  userToken: string
}

const ListUsers: FC<Props> = ({ userToken }) => {
  const columns = [{
    header: 'Id',
    property: 'userId'
  }, {
    header: 'Name',
    property: 'name'
  },{
    header: 'Member since',
    property: 'createdAt'
  }];

  const [users, setUsers] = useState<User[]>([]);

  const service = new UserService();

  if (!users.length) {
    service.getUsers(userToken)
        .then(users => setUsers(users));
  }

  return(
    <div>
      <h2>List Users</h2>
      <DataGrid columns={columns} dataSource={users} />
    </div>
  );
}

ListUsers.propTypes = {
  userToken: PropTypes.string.isRequired
}

export default ListUsers;