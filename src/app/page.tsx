import { Profile } from "./_components/profile";
import { SideQuestAvailable } from "./_components/side-quest-available";
import { SideQuestTaken } from "./_components/side-quest-taken";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <Profile />

      <SideQuestTaken />

      <SideQuestAvailable />
    </div>
  );
}
