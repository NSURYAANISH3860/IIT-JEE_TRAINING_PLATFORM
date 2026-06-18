import { useEffect, useState } from "react";
import {
  BookOpen,
  Crown,
  GraduationCap,
  Mail,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { User } from "../services/api";

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        // Fall back to localStorage
        const storedUser = localStorage.getItem("current_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  if (loading) {
    return (
      <main className="dashboard-profile-page">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="dashboard-profile-page">
        <p>Failed to load profile</p>
      </main>
    );
  }

  const profileDetails = [
    {
      icon: Mail,
      label: "Email",
      value: user.email,
    },
    {
      icon: GraduationCap,
      label: "Class Level",
      value: user.class_level || "Not specified",
    },
    {
      icon: BookOpen,
      label: "Target Exam",
      value: user.target_exam,
    },
    {
      icon: Crown,
      label: "Account Status",
      value: user.is_active ? "Active" : "Inactive",
    },
    {
      icon: Settings,
      label: "Account Type",
      value: user.role === "student" ? "Student" : "Admin",
    },
  ];

  const getInitial = () => user.name.charAt(0).toUpperCase();

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
          <span className="dashboard-profile-large-avatar">{getInitial()}</span>
          <h2>{user.name}</h2>
          <p>{user.class_level ? `Class ${user.class_level}` : "JEE Aspirant"} - {user.target_exam}</p>
          <strong>
            <Crown size={15} aria-hidden="true" />
            Premium Access - Active
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
