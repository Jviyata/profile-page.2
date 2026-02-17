import FetchedProfiles from "../components/FetchedProfiles";
import Wrapper from "../components/Wrapper";

export default function FetchedProfilePage() {
  return (
    <Wrapper>
      <div className="space-y-6" data-testid="section-other">
        <h2 className="text-2xl font-bold text-center text-foreground">Other Profiles</h2>
        <p className="text-center text-sm text-muted-foreground">
          All profiles fetched from the database.
        </p>
        <FetchedProfiles />
      </div>
    </Wrapper>
  );
}
