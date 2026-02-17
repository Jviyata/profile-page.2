import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "../components/Card";
import Filters from "../components/Filters";
import Wrapper from "../components/Wrapper";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [customProfiles, setCustomProfiles] = useState([]);

  // Load custom profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customProfiles");
    if (stored) {
      try {
        setCustomProfiles(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing custom profiles:", e);
      }
    }
  }, []);

  const handleDeleteProfile = (profileId) => {
    const updatedProfiles = customProfiles.filter((p) => p.id !== profileId);
    setCustomProfiles(updatedProfiles);
    localStorage.setItem("customProfiles", JSON.stringify(updatedProfiles));
  };

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ["/api/profiles"],
  });

  // Combine default profiles with custom profiles
  const allProfiles = [...profiles, ...customProfiles];
  const roles = ["All", ...Array.from(new Set(allProfiles.map((p) => p.role))).sort()];

  const filtered = allProfiles.filter((p) => {
    if (roleFilter !== "All" && p.role !== roleFilter) return false;
    if (!search) return true;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Wrapper>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground" data-testid="text-page-title">
          Profiles
        </h2>

        <Filters
          roles={roles}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          search={search}
          setSearch={setSearch}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">Failed to load profiles.</div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No profiles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="section-profiles">
            {filtered.map((profile) => (
              <Card key={profile.id} profile={profile} onDelete={handleDeleteProfile} />
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
