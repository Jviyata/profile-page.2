import AddProfileForm from "../components/AddProfileForm";
import Wrapper from "../components/Wrapper";

export default function AddProfilePage({ onSuccess }) {
  return (
    <Wrapper>
      <div className="space-y-6" data-testid="section-add-profile">
        <h2 className="text-2xl font-bold text-center text-foreground">Add New Profile</h2>
        <AddProfileForm onSuccess={onSuccess} />
      </div>
    </Wrapper>
  );
}
