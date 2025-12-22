import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { RoleSelectionScreen } from "@/components/auth/RoleSelectionScreen";

export default function SelectRolePage() {
  return (
    <AuthWrapper>
      <RoleSelectionScreen />
    </AuthWrapper>
  );
}
