import { Dropdown } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user, profile, isSuperAdmin } = useAuth();

  // Get user display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get short name for header
  const getShortName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user role display
  const getRoleDisplay = () => {
    if (isSuperAdmin) {
      return 'Super Admin';
    }
    if (profile?.role === 'company_admin') {
      return 'Company Admin';
    }
    if (profile?.role === 'employee') {
      return 'Employee';
    }
    return profile?.role || 'User';
  };

  // Get avatar URL or default
  const getAvatarUrl = () => {
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    return '/images/administrator.jpg';
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = getDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Dropdown className="admin-profile">
        <Dropdown.Toggle className="d-xxl-flex align-items-center bg-transparent border-0 text-start p-0 cursor">
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                className="rounded-circle wh-40 administrator"
                src={getAvatarUrl()}
                alt="profile"
                width={40}
                height={40}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#605DFF',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                {getInitials()}
              </div>
            )}
          </div>

          <div className="flex-grow-1 ms-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-none d-xxl-block">
                <div className="d-flex align-content-center">
                  <h3>{getShortName()}</h3>
                </div>
              </div>
            </div>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu className="border-0 bg-white dropdown-menu-end">
          <div className="d-flex align-items-center info">
            <div className="flex-shrink-0">
              {profile?.avatar_url ? (
                <img
                  className="rounded-circle wh-30 administrator"
                  src={getAvatarUrl()}
                  alt="profile"
                  width={30}
                  height={30}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#605DFF',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '11px'
                  }}
                >
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="flex-grow-1 ms-2">
              <h3 className="fw-medium">{getDisplayName()}</h3>
              <span className="fs-12">{getRoleDisplay()}</span>
            </div>
          </div>

          <ul className="admin-link ps-0 mb-0 list-unstyled">
            <li>
              <a
                className="dropdown-item d-flex align-items-center text-body"
                href="/my-profile/"
              >
                <i className="material-symbols-outlined">account_circle</i>
                <span className="ms-2">My Profile</span>
              </a>
            </li>

            <li>
              <a
                className="dropdown-item d-flex align-items-center text-body"
                href="/logout/"
              >
                <i className="material-symbols-outlined">logout</i>
                <span className="ms-2">Logout</span>
              </a>
            </li>
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Profile;
