import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { getChildrenByParentId, type Child } from "../../data/dummyData";

export const Route = createFileRoute("/parent/dashboard")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const { parent, logout, setCurrentChild } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>(
    parent ? getChildrenByParentId(parent.id) : [],
  );
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState("");

  useEffect(() => {
    if (!parent) {
      navigate({ to: "/login" });
    }
  }, [parent, navigate]);

  if (!parent) {
    return null;
  }

  const avatars = ["👧", "👦", "🧒", "👶", "🦸‍♀️", "🦸‍♂️"];

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();

    const newChild: Child = {
      id: `c${Date.now()}`,
      parentId: parent.id,
      name: newChildName,
      age: parseInt(newChildAge),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      points: 0,
      level: 1,
      portfolioValue: 0,
      createdAt: new Date().toISOString(),
    };

    setChildren([...children, newChild]);
    setNewChildName("");
    setNewChildAge("");
    setShowAddChild(false);
  };

  const handleChildLogin = (child: Child) => {
    setCurrentChild(child);
    navigate({ to: "/home" });
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E3F5FF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1B262C] mb-2">
              👋 Welcome, {parent.name}!
            </h1>
            <p className="text-[#7D8B91] text-lg">
              Manage your children's accounts
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card gradient="blue" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2E8BC0] rounded-full flex items-center justify-center text-3xl">
                👨‍👩‍👧‍👦
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Total Children</p>
                <p className="text-3xl font-bold text-[#2E8BC0]">
                  {children.length}
                </p>
              </div>
            </div>
          </Card>

          <Card gradient="yellow" className="shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFD447] rounded-full flex items-center justify-center text-3xl">
                💰
              </div>
              <div>
                <p className="text-[#7D8B91] text-sm">Total Portfolio Value</p>
                <p className="text-3xl font-bold text-[#D4A016]">
                  $
                  {children
                    .reduce((sum, child) => sum + child.portfolioValue, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1B262C]">Your Children</h2>
          <Button onClick={() => setShowAddChild(true)}>➕ Add Child</Button>
        </div>

        {showAddChild && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-[0_16px_48px_rgba(0,0,0,0.2)]">
              <h3 className="text-2xl font-bold text-[#1B262C] mb-4">
                Add a Child
              </h3>
              <form onSubmit={handleAddChild} className="space-y-4">
                <div>
                  <label className="block text-[#1B262C] font-medium mb-2">
                    Child's Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Emma"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#1B262C] font-medium mb-2">
                    Age
                  </label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Add Child
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddChild(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {children.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-[#1B262C] mb-2">
              No children added yet
            </h3>
            <p className="text-[#7D8B91] mb-6">
              Add your first child to get started with Aspire
            </p>
            <Button onClick={() => setShowAddChild(true)}>
              ➕ Add Your First Child
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <Card
                key={child.id}
                hover
                className="shadow-md group cursor-pointer"
                onClick={() => handleChildLogin(child)}
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#E3F5FF] to-[#B8E6FF] rounded-full flex items-center justify-center text-5xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {child.avatar}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B262C] mb-1">
                    {child.name}
                  </h3>
                  <p className="text-[#7D8B91] mb-4">Age {child.age}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#7D8B91]">Level</span>
                      <span className="text-lg font-bold text-[#2E8BC0]">
                        {child.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#7D8B91]">Points</span>
                      <span className="text-lg font-bold text-[#FFD447]">
                        {child.points}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#7D8B91]">Portfolio</span>
                      <span className="text-lg font-bold text-[#2EC4B6]">
                        ${child.portfolioValue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Login as {child.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
