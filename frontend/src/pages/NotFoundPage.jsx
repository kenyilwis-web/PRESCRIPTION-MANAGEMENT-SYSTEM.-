import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="btn btn-primary" to="/">
        Return home
      </Link>
    </div>
  );
}
