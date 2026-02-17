import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";

export default function NotFoundPage() {
  return (
    <Wrapper>
      <div className="text-center space-y-4 py-12" data-testid="section-not-found">
        <h2 className="text-4xl font-bold text-foreground">404</h2>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          data-testid="link-go-home"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </Wrapper>
  );
}
