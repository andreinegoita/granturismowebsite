import React, { useEffect, useState } from "react";
import { licenseService } from "../services/api";
import type { License, UserLicense } from "../types";
import "../styles/LicenseManager.css";

type LicenseStats = {
  total_licenses: number;
  gold_count: number;
  silver_count: number;
  bronze_count: number;
};

export const LicenseManager: React.FC = () => {
  const [allLicenses, setAllLicenses] = useState<License[]>([]);
  const [userLicenses, setUserLicenses] = useState<UserLicense[]>([]);
  const [stats, setStats] = useState<LicenseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLicenses();
  }, []);

  const loadLicenses = async () => {
    try {
      const [allRes, userRes, statsRes] = await Promise.all([
        licenseService.getAllLicenses(),
        licenseService.getUserLicenses(undefined),
        licenseService.getStats(),
      ]);

      setAllLicenses(allRes.data);
      setUserLicenses(userRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to load licenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLicenseData = (licenseId: number) =>
    userLicenses.find((ul) => ul.licenseId === licenseId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "gold":
        return "#ffd700";
      case "silver":
        return "#c0c0c0";
      case "bronze":
        return "#cd7f32";
      default:
        return "#ddd";
    }
  };

  const getDifficultyStars = (difficulty: number) =>
    "⭐".repeat(difficulty);

  if (loading) return <div className="loading">Loading licenses...</div>;

  return (
    <div className="license-manager">
      <header className="license-header">
        <h1>🏆 License Center</h1>
        <p>Earn your licenses to compete in professional racing</p>
      </header>

      {stats && (
        <div className="license-stats">
          <div className="stat-box">
            <h3>Total Licenses</h3>
            <p className="big-number">{stats.total_licenses ?? 0}</p>
          </div>

          <div className="stat-box gold">
            <h3>🥇 Gold</h3>
            <p className="big-number">{stats.gold_count ?? 0}</p>
          </div>

          <div className="stat-box silver">
            <h3>🥈 Silver</h3>
            <p className="big-number">{stats.silver_count ?? 0}</p>
          </div>

          <div className="stat-box bronze">
            <h3>🥉 Bronze</h3>
            <p className="big-number">{stats.bronze_count ?? 0}</p>
          </div>
        </div>
      )}

      <div className="licenses-grid">
        {allLicenses.map((license) => {
          const userLicense = getUserLicenseData(license.id!);
          const isObtained = !!userLicense;

          const completionPercentage = userLicense
            ? (userLicense.testsCompleted / userLicense.totalTests) * 100
            : 0;

          return (
            <div
              key={license.id}
              className={`license-card ${isObtained ? "obtained" : "locked"}`}
            >
              <div
                className="license-badge"
                style={{
                  background: isObtained
                    ? `linear-gradient(135deg,
                        ${getStatusColor(userLicense.status)},
                        ${getStatusColor(userLicense.status)}dd)`
                    : "#ddd",
                }}
              >
                <span className="license-code">{license.code}</span>
              </div>

              <div className="license-content">
                <h3>{license.name}</h3>
                <p className="license-description">{license.description}</p>

                <div className="license-difficulty">
                  <span>Difficulty:</span>
                  <span>{getDifficultyStars(license.difficulty)}</span>
                </div>

                {isObtained ? (
                  <>
                    <div className="license-progress">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${completionPercentage}%`,
                            background: getStatusColor(userLicense.status),
                          }}
                        ></div>
                      </div>

                      <span className="progress-text">
                        {userLicense.testsCompleted}/{userLicense.totalTests} tests
                        completed
                      </span>
                    </div>

                    <div className="license-status">
                      <span
                        className="status-badge"
                        style={{
                          background: getStatusColor(userLicense.status),
                        }}
                      >
                        {userLicense.status.toUpperCase()}
                      </span>

                      {userLicense.bestTime && (
                        <span className="best-time">
                          ⏱️ Best: {userLicense.bestTime.toFixed(3)}s
                        </span>
                      )}
                    </div>

                    <p className="obtained-date">
                      Obtained:{" "}
                      {new Date(userLicense.obtainedAt).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <div className="license-locked">
                    <span>🔒 Not yet obtained</span>
                    <button className="start-btn">Start License</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
