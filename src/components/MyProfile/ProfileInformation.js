import { Card } from "react-bootstrap";
import { useAuth } from "@/context/AuthContext";

const ProfileInformation = () => {
  const { user, profile, isSuperAdmin } = useAuth();

  // Get user display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
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

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <>
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <h3 className="mb-3 mb-lg-4">Profile Information</h3>

          <ul className="ps-0 mb-0 list-unstyled">
            <li className="d-flex align-items-center mb-2 pb-1">
              <span>Full Name:</span>
              <span className="text-secondary fw-medium ms-1">
                {getDisplayName()}
              </span>
            </li>

            <li className="d-flex align-items-center mb-2 pb-1">
              <span>Email:</span>
              <span className="text-secondary fw-medium ms-1">
                {user?.email || 'N/A'}
              </span>
            </li>

            <li className="d-flex align-items-center mb-2 pb-1">
              <span>Phone:</span>
              <span className="text-secondary fw-medium ms-1">
                {profile?.phone || 'Not set'}
              </span>
            </li>

            <li className="d-flex align-items-center mb-2 pb-1">
              <span>Role:</span>
              <span className="text-secondary fw-medium ms-1">
                {getRoleDisplay()}
              </span>
            </li>

            <li className="d-flex align-items-center">
              <span>Join Date:</span>
              <span className="text-secondary fw-medium ms-1">
                {formatDate(profile?.created_at)}
              </span>
            </li>
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfileInformation;
