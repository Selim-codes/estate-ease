import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { LoginCredentials } from "@/types";
import { toast } from "sonner";

export const LoginForm = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field when the user starts typing
    if (errors[name as keyof LoginCredentials]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const user = await api.login(formData);
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login helpers
  const loginAsAgent = async () => {
    setIsLoading(true);
    try {
      await api.login({ email: "sarah.johnson@example.com", password: "password" });
      toast.success("Logged in as Agent");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setIsLoading(true);
    try {
      await api.login({ email: "admin@example.com", password: "password" });
      toast.success("Logged in as Admin");
      navigate("/admin");
    } catch (error) {
      toast.error("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Log In"}
      </Button>

      <div className="mt-8">
        <p className="text-sm text-center text-gray-600 mb-3">
          For demo purposes:
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loginAsAgent}
            disabled={isLoading}
          >
            Login as Agent
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loginAsAdmin}
            disabled={isLoading}
          >
            Login as Admin
          </Button>
        </div>
      </div>
    </form>
  );
};
