import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInterest,
  setSkills,
  setRole,
  removeSkill,
  removeInterest,
} from "../redux/reducers/filterSlice";

export function FilterDialog({ submit }: { submit: any }) {
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();

  // Fetching skills, interests, and role from Redux state
  const { skills, interest: interests, role } = useSelector(
    (state: any) => state.filter.filter
  );

  const handleAddChip = (type: "skills" | "interest", value: string) => {
    if (value.trim()) {
      if (type === "skills") {
        dispatch(setSkills([...skills, value.trim()])); // Update Redux state
      }
      if (type === "interest") {
        dispatch(setInterest([...interests, value.trim()])); // Update Redux state
      }
    }
  };

  const handleRemoveChip = (type: "skills" | "interest", index: number) => {
    if (type === "skills") {
      dispatch(removeSkill(index)); // Dispatch removeSkill action
    }
    if (type === "interest") {
      dispatch(removeInterest(index)); // Dispatch removeInterest action
    }
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Apply Filters <Filter />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply Filters</DialogTitle>
        </DialogHeader>

        {/* Role Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => dispatch(setRole(e.target.value))}
            className="w-full border border-gray-300 bg-transparent rounded-md p-2"
          >
            <option value="mentor" className="bg-black">
              Mentor
            </option>
            <option value="mentee" className="bg-black">
              Mentee
            </option>
          </select>
        </div>

        {/* Skills Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Skills</label>
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
            {skills &&
              skills.map((skill: string, index: number) => (
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
        </div>

        {/* Interests Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Interests</label>
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
            {interests &&
              interests.map((interest: string, index: number) => (
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
        </div>

        {/* Submit Button */}
        <DialogFooter>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
              submit();
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
