import './RolePermissions.css';

const PERMISSIONS = [
  'Manage Users','Manage Needs','Manage Proposals','Manage Messages',
  'View Analytics','Verify Accounts','Manage Mobile App','Edit Content (CMS)',
  'Platform Settings','Manage Marketing','View Support Tickets',
  'Respond to Tickets','Manage Admin Roles','View Activity Log',
];

export default function RolePermissions() {
  return (
    <div className="rp__card">
      <div className="rp__header">
        <span className="rp__title">Role Permissions</span>
      </div>
      <div className="rp__table-wrap">
        <table className="rp__table">
          <thead>
            <tr>
              <th>PERMISSION</th>
              <th style={{color:'#EF4444'}}>SUPER<br/>ADMIN</th>
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((p,i) => (
              <tr key={i}>
                <td className="rp__perm">{p}</td>
                <td className="rp__check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
