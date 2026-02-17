import { useQuery } from "@tanstack/react-query";
import Card from "./Card";
import { Loader2 } from "lucide-react";

export default function FetchedProfiles() {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["/api/profiles"],
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <Card key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
