import { useStore } from "@tanstack/react-store";
import { RefreshCw, Shuffle, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Student } from "@/lib/db";
import { studentsStore } from "@/lib/stores";
import { NumberInput } from "./number-input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

interface Pair {
  id: string;
  students: Student[];
  color: string;
}

const pairColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export default function MainPage() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [memberCount, setMemberCount] = useState(2);

  const students = useStore(studentsStore);

  const shuffleArray = (array: Student[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createPairs = () => {
    if (students.length < 2) {
      toast.error("You need at least 2 students to create pairs.");
      return;
    }

    const shuffledStudents = shuffleArray(students);
    const newPairs: Pair[] = [];
    let members = memberCount;
    let teams = teamCount;

    if (!teams && members > 0) {
      teams = Math.ceil(students.length / members);
    } else if (!members && teams > 0) {
      members = Math.ceil(students.length / teams);
    }

    // for (let i = 0; i < shuffledStudents.length; i += size) {
    //   const groupStudents = shuffledStudents.slice(i, i + size);
    //   if (groupStudents.length > 0) {
    //     newPairs.push({
    //       id: `pair-${newPairs.length + 1}`,
    //       students: groupStudents,
    //       color: pairColors[newPairs.length % pairColors.length],
    //     });
    //   }
    // }
    while (shuffledStudents.length > 0 && teams > 0) {
      const size = shuffledStudents.length < members ? shuffledStudents.length : members;
      const team = [];

      for (let i = 0; i < size; i++) {
        const index = Math.floor(Math.random() * shuffledStudents.length);
        team.push(shuffledStudents.splice(index, 1)[0]);
      }

      newPairs.push({
        id: `pair-${newPairs.length + 1}`,
        students: team,
        color: pairColors[newPairs.length % pairColors.length],
      });
      teams--;
    }

    setPairs(newPairs);
    // toast(`Successfully created ${newPairs.length} ${teams === 2 ? "pairs" : "groups"}.`);
  };

  // const reshufflePairs = () => {
  //   if (students.length < 2) return;
  //   createPairs();
  //   // toast("All pairs have been redistributed.");
  // };

  // const exportPairs = () => {
  //   const exportData = pairs
  //     .map(
  //       (pair, index) =>
  //         `${pairingMethod === "pairs" ? "Pair" : "Group"} ${index + 1}: ${pair.students.map((s) => s.name).join(" & ")}`,
  //     )
  //     .join("\n");

  //   navigator.clipboard.writeText(exportData);
  //   toast.success("Pair assignments have been copied to clipboard.");
  // };

  const clearPairs = () => {
    setPairs([]);
    // toast.success("All pair assignments have been removed.");
  };

  return (
    <div className="flex-1">
      <div className="mx-auto">
        {/* Header */}
        <div className="items-center space-y-4 mx-6 mt-6 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Divide Students</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-gray-300 text-xs">Team count:</Label>
              <NumberInput value={teamCount} setValue={setTeamCount} />
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-gray-300 text-xs">Member count:</Label>
              <NumberInput value={memberCount} setValue={setMemberCount} />
            </div>

            <div className="flex gap-2">
              <Button onClick={createPairs} disabled={students.length < 2}>
                <Shuffle className="w-4 h-4 mr-2" />
                Create {memberCount === 2 ? "Pairs" : "Groups"}
              </Button>

              {/* {pairs.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={reshufflePairs}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reshuffle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportPairs}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportPairs}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </>
              )} */}
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-auto p-4 border-y border-border">
          {/* Results Area */}
          {pairs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No pairs created yet</h3>
              <p className="text-center max-w-md">
                Add some students to the list and click "Create {memberCount === 2 ? "Pairs" : "Groups"}" to get
                started.
              </p>
              <div className="mt-6 text-sm text-gray-500">Current students: {students.length}</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {pairs.map((pair, index) => (
                <Card key={`pair_${pair.id}`} className="p-2 text-xs gap-2">
                  <CardHeader className="pb-0 mb-0 p-0 flex justify-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${pair.color}`} />
                      <CardTitle className="text-white text-sm">
                        {memberCount === 2 ? "Pair" : "Group"} {index + 1}
                      </CardTitle>
                      <Badge variant="secondary">{pair.students.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-0 mt-0">
                    <div className="space-y-1">
                      {pair.students.map((student) => (
                        <div key={`student_${student.id}`} className="flex items-center gap-3 p-0.5 rounded-lg">
                          <span className="text-gray-200 font-medium">{student.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="p-5 flex items-center justify-between text-gray-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total:</span>
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {students.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{memberCount === 2 ? "Pairs" : "Groups"}:</span>
              <Badge variant="secondary" className="bg-green-600 text-white">
                {pairs.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Assigned:</span>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {pairs.reduce((sum, pair) => sum + pair.students.length, 0)}
              </Badge>
            </div>
            {students.length > pairs.reduce((sum, pair) => sum + pair.students.length, 0) && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Remaining:</span>
                <Badge variant="secondary" className="bg-orange-600 text-white">
                  {students.length - pairs.reduce((sum, pair) => sum + pair.students.length, 0)}
                </Badge>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={() => clearPairs()}>
            <RefreshCw /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
