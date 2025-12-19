import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Plus,
  Loader2,
  X,
  Mail,
  User,
} from 'lucide-react';
import { authRest } from '@/services/api';

const AdminDashboard: React.FC = () => {
  // State for Add Team Member form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'manager', // default
  });
  const [loading, setLoading] = useState(false);
  const [addedMembers, setAddedMembers] = useState<any[]>([]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Add Team Member
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: 'Error',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Call backend endpoint
      const response = await authRest.addManager(
        formData.name,
        formData.email,
        formData.role as 'manager' | 'hr' // Cast to correct type
      );

      if (response.success) {
        toast({
          title: 'Success!',
          description: `${formData.name} has been added as ${formData.role}`,
        });

        // Add to recently added list
        setAddedMembers((prev) => [
          {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            addedAt: new Date().toLocaleString(),
          },
          ...prev,
        ]);

        // Reset form
        setFormData({
          name: '',
          email: '',
          role: 'manager',
        });

        // Close form
        setShowAddForm(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Team Member Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Admin</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Cancel' : 'Add Team Member'}
          </Button>
        </div>

        {/* Add Team Member Form */}
        {showAddForm && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader className="bg-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add New Team Member
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Add a Manager, HR Manager, or Employee to your team
              </p>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleAddTeamMember} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., john@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                {/* Role Selection Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="manager">Manager</option>
                    <option value="hr">HR Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Role determines dashboard access and permissions
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Adding Member...' : 'Add Team Member'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Recently Added Users Section */}
        {addedMembers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Added Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {addedMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>

                      {/* Member Info */}
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Role: <span className="font-semibold text-gray-600">{member.role}</span>
                          {' '} • Added: {member.addedAt}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        ✓ Created
                      </span>
                      <p className="text-xs text-gray-400 mt-2">
                        Email sent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other Dashboard Content Below */}
        {/* ... your existing dashboard content ... */}
      </div>
    </div>
  );
};

export default AdminDashboard;