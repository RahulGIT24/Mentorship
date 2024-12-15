import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import apiCall from "../lib/apiCall";
import { setUser } from "../redux/reducers/userSlice";

const formSchema = z.object({
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  role: z.enum(["mentor", "mentee"]),
  skills: z.string().array().min(1, "At least one skill is required"),
  interest: z.string().array().min(1, "At least one interest is required"),
});

export function UpdateDialog() {
  const [loading, setLoading] = useState(false);
  const data = useSelector((state: any) => state.user.user);
  const [skills, setSkills] = useState<string[]>(data.skills || []);
  const [interests, setInterests] = useState<string[]>(data.interest || []);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: data.bio,
      role: data.role,
      skills,
      interest: interests,
    },
  });

  const handleAddChip = (type: "skills" | "interest", value: string) => {
    if (value.trim()) {
      if (type === "skills") setSkills((prev) => [...prev, value.trim()]);
      if (type === "interest") setInterests((prev) => [...prev, value.trim()]);
    }
  };

  const handleRemoveChip = (type: "skills" | "interest", index: number) => {
    if (type === "skills") {
      setSkills((prev) => prev.filter((_, i) => i !== index));
    }
    if (type === "interest") {
      setInterests((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const dispatch = useDispatch();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await apiCall({
      method: "PUT",
      url: "users/update-account",
      reqData: { ...values, skills, interest: interests },
    });
    setLoading(false);
    if (res.status > 201) {
      toast.error(res.message, { duration: 3000 });
    } else {
      toast.success(res.message, { duration: 3000 });
      dispatch(setUser(res.data));
      setIsDialogOpen(false);
    }
  }

  const handleDialogOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);

    if (isOpen) {
      // Reset form and input states when dialog opens
      form.reset({
        bio: data.bio,
        role: data.role,
        skills: data.skills || [],
        interest: data.interest || [],
      });
      setSkills(data.skills || []);
      setInterests(data.interest || []);
      setSkillInput("");
      setInterestInput("");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            {/* Bio Field */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edit Bio</FormLabel>
                  <br/>
                  <FormControl>
                    <textarea className="bg-transparent border border-gray-300 w-full p-3" placeholder="Enter your bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edit Role</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full border border-gray-300 bg-transparent rounded-md p-2"
                    >
                      <option value="mentor" className="bg-black">Mentor</option>
                      <option value="mentee" className="bg-black">Mentee</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Skills Field */}
            <FormItem>
              <FormLabel>Edit Skills</FormLabel>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChip("skills", skillInput);
                      setSkillInput("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleAddChip("skills", skillInput);
                    setSkillInput("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveChip("skills", index)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </FormItem>

            {/* Interests Field */}
            <FormItem>
              <FormLabel>Edit Interests</FormLabel>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="Add an interest"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChip("interest", interestInput);
                      setInterestInput("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    handleAddChip("interest", interestInput);
                    setInterestInput("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveChip("interest", index)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </FormItem>

            {/* Submit Button */}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
