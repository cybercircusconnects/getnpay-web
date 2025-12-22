"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { authApi, getErrorMessage } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { ShoppingCart, Store, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<
    "customer" | "store_owner"
  >("customer");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSelectRole = async () => {
    setIsLoading(true);
    try {
      const result = await authApi.selectRole({ role: selectedRole });
      apiClient.setToken(result.accessToken);
      setUser(result.user);
      toast.success("Role selected successfully");
      router.push("/dashboard");
    } catch (error) {
      const message = getErrorMessage(error, "Failed to select role");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Select Your Role</h1>
          <p className="text-sm text-muted-foreground">
            Choose how you want to use GetnPay
          </p>
        </div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`w-full relative rounded-lg border-2 p-6 transition-all ${
              selectedRole === "customer"
                ? "border-green-600 bg-green-600"
                : "border-gray-300 bg-background hover:border-gray-400"
            }`}
          >
            {selectedRole === "customer" && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <Check size={16} className="text-green-600" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  selectedRole === "customer"
                    ? "bg-white/20"
                    : "bg-gray-100"
                }`}
              >
                <ShoppingCart
                  size={32}
                  className={
                    selectedRole === "customer"
                      ? "text-white"
                      : "text-gray-600"
                  }
                />
              </div>
              <h3
                className={`mb-2 text-center text-xl font-bold ${
                  selectedRole === "customer"
                    ? "text-white"
                    : "text-foreground"
                }`}
              >
                Customer
              </h3>
              <p
                className={`text-center text-sm leading-5 ${
                  selectedRole === "customer"
                    ? "text-white"
                    : "text-muted-foreground"
                }`}
              >
                Track your purchases
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("store_owner")}
            className={`w-full relative rounded-lg border-2 p-6 transition-all ${
              selectedRole === "store_owner"
                ? "border-green-600 bg-green-600"
                : "border-gray-300 bg-background hover:border-gray-400"
            }`}
          >
            {selectedRole === "store_owner" && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <Check size={16} className="text-green-600" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  selectedRole === "store_owner"
                    ? "bg-white/20"
                    : "bg-gray-100"
                }`}
              >
                <Store
                  size={32}
                  className={
                    selectedRole === "store_owner"
                      ? "text-white"
                      : "text-gray-600"
                  }
                />
              </div>
              <h3
                className={`mb-2 text-center text-xl font-bold ${
                  selectedRole === "store_owner"
                    ? "text-white"
                    : "text-foreground"
                }`}
              >
                Store Owner
              </h3>
              <p
                className={`text-center text-sm leading-5 ${
                  selectedRole === "store_owner"
                    ? "text-white"
                    : "text-muted-foreground"
                }`}
              >
                Manage your store and record purchases
              </p>
            </div>
          </button>
        </div>

        <Button
          type="button"
          onClick={handleSelectRole}
          disabled={isLoading}
          className="w-full h-11 rounded cursor-pointer bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            "Proceed"
          )}
        </Button>
    </div>
  );
}

