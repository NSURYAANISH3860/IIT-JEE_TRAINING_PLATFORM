import { useEffect, useState } from "react";
import {
  BookOpen,
  Crown,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    class_level: string;
    target_exam: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("current_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }
  }, []);

  const name = user?.name || "Aspirant Sharma";
  const email = user?.email || "aspirant@valluri.io";
  const classLevel = user?.class_level || "XII";
  const targetExam = user?.target_exam || "JEE Advanced 2026";
  const avatarLetter = name.trim().charAt(0).toUpperCase() || "A";

  const profileDetails = [
    {
      icon: Mail,
      label: "Email",
      value: email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98... ..420",
    },
    {
      icon: MapPin,
      label: "City",
      value: "Hyderabad, India",
    },
    {
      icon: GraduationCap,
      label: "Target Exam",
      value: targetExam,
    },
    {
      icon: BookOpen,
      label: "Enrolled In",
      value: "Elite Crash Course 2026",
    },
    {
      icon: Settings,
      label: "Plan",
      value: "Elite - Auto-renews 12 May 2026",
    },
  ];

  return (
    <main className="dashboard-profile-page">
      <section className="dashboard-profile-hero">
        <p className="dashboard-overline">Profile</p>
        <h1>
          Your account <em>settings.</em>
        </h1>
      </section>

      <section className="dashboard-profile-content">
        <article className="dashboard-profile-summary-card">
          <span className="dashboard-profile-large-avatar">{avatarLetter}</span>
          <h2>{name}</h2>
          <p>JEE 2026 Aspirant - Class {classLevel}</p>
          <strong>
            <Crown size={15} aria-hidden="true" />
            Elite Subscription - Active
          </strong>
        </article>

        <article className="dashboard-profile-details-card">
          <p className="dashboard-overline">Account</p>
          <h2>Personal details</h2>

          <div className="dashboard-profile-details-grid">
            {profileDetails.map((detail) => {
              const Icon = detail.icon;
              return (
                <div className="dashboard-profile-detail-tile" key={detail.label}>
                  <span>
                    <Icon size={15} aria-hidden="true" />
                    {detail.label}
                  </span>
                  <strong>{detail.value}</strong>
                </div>
              );
            })}
          </div>

          <div className="dashboard-profile-actions">
            <button type="button">Edit Profile</button>
            <Link to="/pricing">Manage Subscription</Link>
          </div>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>© 2026 VALLURI™ IIT-JEE. All rights reserved.</span>
        <Link to="/pricing">Premium plans</Link>
      </footer>
    </main>
  );
}

export default Profile;
