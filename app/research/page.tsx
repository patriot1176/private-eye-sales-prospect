"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewResearchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    additionalContext: "",
  });

  // ✅ Correct place to define handleChange:
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.company.trim()) {
      alert("Please fill in the Name and Company fields.");
      return;
    }

    const profiles = JSON.parse(localStorage.getItem("prospectProfiles") || "{}");
    const newId = Date.now().toString();

    // Save placeholder
    profiles[newId] = {
      name: formData.name,
      company: formData.company,
      title: "",
      email: "",
      phone: "",
      status: "Pending",
      background: "",
      behavioral: "",
      risks: "",
      approach: [],
      rawAnalysis: "",
    };

    localStorage.setItem("prospectProfiles", JSON.stringify(profiles));

    // Call API to generate profile
    try {
      const response = await fetch("/api/generateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      profiles[newId] = {
        ...profiles[newId],
        ...data,
        status: "Complete",
      };

      localStorage.setItem("prospectProfiles", JSON.stringify(profiles));
    } catch (error) {
      console.error("Error generating profile:", error);
      profiles[newId].status = "Failed";
      localStorage.setItem("prospectProfiles", JSON.stringify(profiles));
    }

    setFormData({ name: "", company: "", additionalContext: "" });
    router.push("/prospects");
  };

  const loadSampleData = (sampleType: "printing" | "labels") => {
    setFormData(prev => {
      if (sampleType === "printing") {
        return {
          ...prev,
          name: prev.name || "Lewis Cook",
          company: prev.company || "Catapult Print",
          additionalContext:
            prev.additionalContext ||
            "Printing industry, recent expansion, technology focus",
        };
      } else {
        return {
          ...prev,
          name: prev.name || "John Abbott",
          company: prev.company || "Abbott Label",
          additionalContext:
            prev.additionalContext ||
            "Label manufacturing, family business, customer service focus",
        };
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Private Eye Intelligence Analysis</h1>
      <p className="mb-6 text-gray-600">
        Generate comprehensive OSINT-based prospect profiles
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Target Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Lewis Cook"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Company Name *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Catapult Print"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Additional Intelligence Context</label>
          <textarea
            name="additionalContext"
            value={formData.additionalContext}
            onChange={handleChange}
            placeholder="Industry focus, recent events, specific intel requirements..."
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Generate Intelligence Profile
        </button>
      </form>

      <div className="mt-8">
        <p className="text-gray-600 mb-2">Quick Test with Sample Data:</p>
        <div className="flex gap-2">
  <button
    onClick={() => loadSampleData("printing")}
    className="border px-4 py-1 rounded hover:bg-gray-100"
  >
    🖨️ Printing Co.
  </button>
  <button
    onClick={() => loadSampleData("labels")}
    className="border px-4 py-1 rounded hover:bg-gray-100"
  >
    🏷️ Label Mfg.
   </button>
</div>
</div>
</div>
  );
}
