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
import apiCall from "../lib/apiCall";
import toast from "react-hot-toast";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
});

function ForgotPasswordPage() {
  const [loading,setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send password recovery email
    setLoading(true);
    const res = await apiCall({method:"POST",url:"auth/forgot-password",reqData:values});
    if(res.status===200){
      toast.success(res.message)
    }else{
      toast.error(res.message)
    }
    setLoading(false);
  }
  return (
    <main className="w-full justify-center items-center flex h-screen flex-col">
      <p className="text-2xl my-6">
        Recover Your <b className="text-purple-700">MentorSphere</b> Account
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
                  <Input placeholder="Enter Your Email Address" type="email" required {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button  type="submit" disabled={loading}>{loading ? "Sending.....": "Send Password Recovery Email"}</Button>
        </form>
      </Form>
    </main>
  );
}
export default ForgotPasswordPage;
