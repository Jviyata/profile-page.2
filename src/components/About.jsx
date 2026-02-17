export default function About() {
  return (
    <div className="max-w-2xl mx-auto space-y-4" data-testid="section-about">
      <h2 className="text-2xl font-bold text-foreground">About</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        A simple profile directory app. Browse profiles, search by name, filter by role, and add new members to the directory.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        This app is built to showcase student and professional profiles in a clean, easy-to-browse format.
      </p>
    </div>
  );
}
