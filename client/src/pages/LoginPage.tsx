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
import toast from "react-hot-toast";
import { useState } from "react";
import { setAuth, setUser } from "../redux/reducers/userSlice";
import { useDispatch } from "react-redux";
import Navbar from "@/components/Navbar";

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
  email: z.string().email({ message: "Invalid Email Address" }),
  password: passwordSchema,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await apiCall({
      method: "POST",
      url: "auth/login",
      reqData: values,
    });
    setLoading(false);
    if(res.status===201){
      toast.success(res.message);
      return;
    }
    if (res.status === 200) {
      dispatch(setUser(res.data));
      dispatch(setAuth(res.data.verificationStatus))
      toast.success(res.message);
      navigate("/");
    } else {
      toast.error(res.message);
    }
  }
  return (
    <>
      <Navbar/>
    <main className="w-full justify-center items-center flex h-screen flex-col">
      <p className="text-2xl my-6">
        Welcome to <b className="text-purple-700">MentorSphere</b>
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Email Address" {...field} />
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
                  <Input placeholder="Enter Your Password" {...field} type="password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Logging In" : "Login"}
          </Button>
        </form>
      </Form>
      <p className="text-lg mb-6">
        <span
          onClick={() => {
            navigate("/forgot-password");
          }}
          className="font-bold underline text-purple-700 cursor-pointer"
        >
          Forgot Password?
        </span>
      </p>
      <p>Or</p>
      <p className="text-lg my-6">
        Don't have an account?{" "}
        <span
          onClick={() => {
            navigate("/register");
          }}
          className="font-bold underline text-purple-700 cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </main>
    </>
  );
}
export default LoginPage;
