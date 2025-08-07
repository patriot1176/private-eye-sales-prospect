"use client";

import { useEffect, useState } from "react";

type Profile = {
  id?: string;
  name?: string;
  prospectName?: string;
  company?: string;
  companyName?: string;
  title?: string;
  email?: string;
  phone?: string;
  status?: string;
  background?: string;
  behavioral?: string;
  risks?: string;
  approach?: string[];
  rawAnalysis?: string;
};

export default function ResultsPage() {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  useEffect(() => {
    const data = localStorage.getItem("prospectProfiles");
    if (data) {
      setProfiles(JSON.parse(data));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = { ...profiles };
    delete updated[id];
    setProfiles(updated);
    localStorage.setItem("prospectProfiles", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved Prospect Profiles</h1>

      {Object.keys(profiles).length === 0 ? (
        <p className="text-gray-500">No saved prospects yet.</p>
      ) : (
        <ul className="space-y-4">
          {Object.entries(profiles).map(([id, profile]) => (
            <li key={id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile.name || profile.prospectName}
                  </h2>
                  <span className="text-gray-600">
                    {profile.company || profile.companyName}
                  </span>
                  <p className="text-sm text-gray-600 mb-2">
                    {profile.title} | Status: <strong>{profile.status}</strong>
                  </p>
                  <details className="text-sm mt-2 space-y-1">
                    <summary className="cursor-pointer text-blue-600">View Full Profile</summary>
                    <p><strong>Email:</strong> {profile.email || ""}</p>
                    <p><strong>Phone:</strong> {profile.phone || ""}</p>
                    <p><strong>Background:</strong> {profile.background || ""}</p>
                    <p><strong>Behavioral:</strong> {profile.behavioral || ""}</p>
                    <p><strong>Risks:</strong> {profile.risks || ""}</p>
                    <p><strong>Raw Analysis:</strong> {profile.rawAnalysis || ""}</p>
                    {profile.approach?.length ? (
                      <div>
                        <p><strong>Approach:</strong></p>
                        <ul className="list-disc ml-6">
                          {profile.approach.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </details>
                </div>
                <button
                  onClick={() => handleDelete(id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
