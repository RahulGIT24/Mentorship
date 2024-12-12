import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import apiCall from "../lib/apiCall";
import toast from "react-hot-toast";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" }) // Minimum length
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  }) // At least one lowercase
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  }) // At least one uppercase
  .regex(/\d/, { message: "Password must contain at least one number" }) // At least one number
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must contain at least one special character",
  }); // At least one special character

const formSchema = z.object({
  password: passwordSchema,
  confirm_password: passwordSchema,
});

function ResetPassword() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirm_password: "",
      password: "",
    },
  });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("token")) {
      navigate("/login");
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values.confirm_password) {
      toast.error("Passwords do not match");
    }
    if (searchParams.get("token")) {
      // reset password with token
      const res = await apiCall({
        method: "PATCH",
        url: `auth/change-password?token=${searchParams.get("token")}`,
        reqData: {
          password: values.password,
          confirmPassword: values.confirm_password,
        },
      });
      if (res.status === 200) {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message);
      }
    }
  }
  return (
    <main className="w-full justify-center items-center flex h-screen flex-col">
      <p className="text-2xl my-6">
        Reset Your <b className="text-purple-700">MentorSphere</b> Password
      </p>
      {/* <ModeToggle/> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter new password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Password" {...field} required type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-enter new password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm Your Password" {...field} required type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Change Password</Button>
        </form>
      </Form>
    </main>
  );
}
export default ResetPassword;
