import { Button } from "./ui/button";
import { Icons } from "./icons";

const OAuth = () => {
  const oauthHandler = (target: "google" | "github" | "facebook") => {
    // Your OAuth flow code goes here
    // Redirect to the target's OAuth endpoint
    const endpoint = import.meta.env.VITE_SERVER_URI;
    window.open(`${endpoint}/api/v1/auth/${target}`, "_self");
  };
  return (
    <div className="grid grid-cols-2 gap-6">
      <Button variant="outline" onClick={() => oauthHandler("github")}>
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button variant="outline" onClick={() => oauthHandler("google")}>
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
};

export default OAuth;
