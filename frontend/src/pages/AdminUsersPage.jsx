import { useEffect, useState } from 'react';
import { api } from '../App.jsx';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/api/admin/users').then((response) => setUsers(response.data.users || [])).catch(() => setUsers([]));
  }, []);

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin users</span>
          <h1>Users</h1>
        </div>
      </div>

      <div className="table-wrap card-surface">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
