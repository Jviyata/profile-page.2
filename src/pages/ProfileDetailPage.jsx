import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import arikaImg from "../assets/arika-gibson.png";
import julianImg from "../assets/julian-luzadder.png";
import lyndieImg from "../assets/lyndie-lingg.png";

const avatarMap = {
  "Arika Gibson": arikaImg,
  "Julian Luzadder": julianImg,
  "Lyndie Lingg": lyndieImg,
};

export default function ProfileDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["/api/profiles"],
  });

  if (isLoading) {
    return <p className="text-center py-12 text-muted-foreground">Loading profile...</p>;
  }

  if (error || !profiles) {
    return <p className="text-center py-12 text-destructive">Unable to load profile.</p>;
  }

  const profile = profiles.find(p => p.id === parseInt(id));

  if (!profile) {
    return <p className="text-center py-12 text-destructive">Profile not found.</p>;
  }

  const avatarSrc = avatarMap[profile.name] || profile.avatarUrl;

  return (
    <div className="flex flex-col items-center pt-16 space-y-6" data-testid="section-profile-detail">
      <div className="max-w-md text-center space-y-4">
        <img
          src={avatarSrc}
          alt={profile.name}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6B7A3A&color=fff&size=200`;
          }}
          className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 mx-auto"
        />
        <h2 className="text-4xl font-bold text-foreground" data-testid="text-profile-name">{profile.name}</h2>
        <p className="text-lg font-medium text-primary" data-testid="text-profile-role">{profile.role}</p>
        <div className="text-base text-muted-foreground space-y-1">
          <p data-testid="text-profile-major">{profile.major} &middot; Class of {profile.year}</p>
          <p data-testid="text-profile-email">{profile.email}</p>
        </div>
        {profile.bio && (
          <p className="text-base text-foreground/80 leading-relaxed" data-testid="text-profile-bio">{profile.bio}</p>
        )}
      </div>
      <div className="text-center">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
