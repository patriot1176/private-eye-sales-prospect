"use client";

import { useEffect, useState } from "react";
import { TargetCard } from "@/components/target-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

type Prospect = {
  id: string;
  name: string;
  company: string;
  status: "Completed" | "In Progress" | "Pending" | "Failed";
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("prospectProfiles");
    if (data) {
      const raw = JSON.parse(data);
      const parsed: Prospect[] = Object.entries(raw).map(([id, value]: [string, any]) => ({
        id,
        name: value.name || value.prospectName || "Unknown",
        company: value.company || value.companyName || "Unknown",
        status: value.status || "Pending",
      }));
      setProspects(parsed);
    }
  }, []);
const handleDelete = (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this?");
  if (!confirmed) return;

  // Remove from localStorage
  const data = localStorage.getItem("prospectProfiles");
  if (data) {
    const profiles = JSON.parse(data);
    delete profiles[id];
    localStorage.setItem("prospectProfiles", JSON.stringify(profiles));
  }

  // Update UI
  setProspects(prev => prev.filter(p => p.id !== id));
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Prospects</h1>
          <p className="text-gray-600 mt-2">Manage and track all your sales prospects</p>
        </div>
        <Link href="/research">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Research
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search prospects..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {prospects.map((prospect) => (
    <TargetCard
      key={prospect.id}
      id={prospect.id}
      name={prospect.name}
      company={prospect.company}
      status={prospect.status}
      onDelete={handleDelete}
    />
  ))}
</div> {/* ➡ This closes the grid div */}
</div> {/* ➡ This closes the outermost container */}
  );
}
