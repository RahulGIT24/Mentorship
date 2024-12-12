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
import { useNavigate } from "react-router-dom";
import apiCall from "../lib/apiCall";
import { useState } from "react";
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

const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" }) // Minimum length
  .max(20, { message: "Username must not exceed 20 characters" }) // Maximum length
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Username can only contain letters, numbers, underscores, or dashes",
  }); // Allowed characters

const formSchema = z.object({
  name: z.string().min(3),
  username: usernameSchema,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: passwordSchema,
});

function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await apiCall({
      method: "POST",
      url: "auth/register",
      withCredentials: false,
      reqData: values,
    });
    setLoading(false);
    if (res.status > 201) {
      toast.error(res.message, { duration: 3000 });
    } else {
      toast.success(res.message, { duration: 3000 });
    }
  }

  const navigate = useNavigate();

  return (
    <main className="w-full justify-center items-center flex h-screen flex-col">
      <p className="text-2xl my-6">
        Signup to <b className="text-purple-700">MentorSphere</b>
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your unique username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Email Address"
                    {...field}
                    type="email"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Password"
                    type="password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Signing Up" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className="text-lg my-6">
        Already have an account?{" "}
        <span
          onClick={() => {
            navigate("/login");
          }}
          className="font-bold underline text-purple-700 cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </main>
  );
}
export default RegistrationPage;
