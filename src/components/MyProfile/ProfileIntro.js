"use client";

import { Card } from "react-bootstrap";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const ProfileIntro = () => {
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
      <Card className="bg-white border-0 rounded-3 mb-4">
        <Card.Body className="p-4">
          <h3 className="mb-3 mb-lg-4">Profile Intro</h3>

          <div className="d-flex align-items-center mb-4">
            <div className="flex-shrink-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  className="rounded-circle border border-2 wh-75"
                  alt="user"
                  width={75}
                  height={75}
                />
              ) : (
                <div
                  className="rounded-circle border border-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: 75,
                    height: 75,
                    backgroundColor: '#605DFF',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '24px'
                  }}
                >
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="flex-grow-1 ms-3">
              <h4 className="fs-17 mb-1 fw-semibold">{getDisplayName()}</h4>
              <span className="fs-14">{getRoleDisplay()}</span>
            </div>
          </div>

          {profile?.bio && (
            <>
              <h4 className="fw-semibold fs-14 mb-2">About Me</h4>
              <p>{profile.bio}</p>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default ProfileIntro;
