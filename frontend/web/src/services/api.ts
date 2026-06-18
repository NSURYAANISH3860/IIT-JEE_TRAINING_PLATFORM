const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  class_level: string;
  target_exam: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export interface SignupResponse {
  message: string;
  user: User;
}

export interface ProgressSummary {
  total_attempts: number;
  average_score: number;
  best_score: number;
  recent_attempts: ExamAttempt[];
  subject_accuracy: Record<string, number>;
  weak_topics: Record<string, number>;
}

export interface ExamAttempt {
  id: string;
  subject: string;
  topic: string;
  total_questions: number;
  correct_answers: number;
  score: number;
  duration_seconds: number;
  created_at: string;
}

export interface ChatResponse {
  reply: string;
  subject?: string;
  topic?: string;
}

export interface StudentActivity {
  id?: string;
  type: "exam" | "course" | "doubt" | "video" | "practice";
  title: string;
  subject: string;
  timestamp: string;
  duration_seconds?: number;
  score?: number;
}

class APIService {
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async signup(
    name: string,
    email: string,
    password: string,
    classLevel: string,
    targetExam: string,
  ): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        email,
        password,
        class_level: classLevel,
        target_exam: targetExam,
      }),
    });
    return this.handleResponse(response);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Student endpoints
  async saveStudentSelection(subject: string, topic: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/student/selection`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ subject, topic }),
    });
    return this.handleResponse(response);
  }

  async getStudentSelection(): Promise<{ selected_subject: string; selected_topic: string }> {
    const response = await fetch(`${API_BASE_URL}/student/selection`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Progress endpoints
  async getProgressSummary(): Promise<ProgressSummary> {
    const response = await fetch(`${API_BASE_URL}/progress/summary`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Exam endpoints
  async getQuestions(subject?: string, topic?: string, limit: number = 10) {
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (topic) params.append("topic", topic);
    params.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/exams/questions?${params}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async submitExam(subject: string, topic: string, answers: any[], durationSeconds: number) {
    const response = await fetch(`${API_BASE_URL}/exams/submit`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        subject,
        topic,
        answers,
        duration_seconds: durationSeconds,
      }),
    });
    return this.handleResponse(response);
  }

  async getExamHistory() {
    const response = await fetch(`${API_BASE_URL}/exams/history`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async chat(message: string, subject?: string, topic?: string): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ message, subject, topic }),
    });
    return this.handleResponse(response);
  }

  async getLeaderboard(subject?: string, topic?: string, limit: number = 10) {
    const params = new URLSearchParams();
    if (subject) params.append("subject", subject);
    if (topic) params.append("topic", topic);
    params.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/exams/leaderboard?${params}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Activity tracking
  async logActivity(activity: StudentActivity): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/student/activity`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          activity_type: activity.type,
          title: activity.title,
          subject: activity.subject,
          duration_seconds: activity.duration_seconds,
          score: activity.score,
        }),
      });
      await this.handleResponse(response);
    } catch (error) {
      console.error("Failed to log activity to backend, using localStorage fallback:", error);
      // Fallback to localStorage
      const activities = JSON.parse(localStorage.getItem("user_activities") || "[]");
      activities.push({ ...activity, id: Date.now().toString() });
      localStorage.setItem("user_activities", JSON.stringify(activities));
    }
  }

  async getUserActivities(): Promise<StudentActivity[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/student/activities`, {
        headers: this.getHeaders(),
      });
      const activities = await this.handleResponse(response);
      return activities.sort((a: StudentActivity, b: StudentActivity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error("Failed to fetch activities from backend, using localStorage:", error);
      // Fallback to localStorage
      const activities = JSON.parse(localStorage.getItem("user_activities") || "[]");
      return activities.sort((a: StudentActivity, b: StudentActivity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");
    window.dispatchEvent(new Event("auth-change"));
  }
}

export const api = new APIService();
