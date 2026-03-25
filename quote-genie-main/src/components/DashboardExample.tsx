import { apiClient } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

/**
 * Example: Dashboard Page Integration with Backend API
 * 
 * This component demonstrates how to:
 * - Fetch data from the backend
 * - Handle authentication
 * - Create, update, and delete resources
 * - Handle loading and error states
 */

export function DashboardExample() {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user and quotations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const userResponse = await apiClient.getCurrentUser();
        setUser(userResponse.user);

        // Get quotations
        const quotationsResponse = await apiClient.getQuotations();
        setQuotations(quotationsResponse.quotations || []);

        toast({
          title: 'Data Loaded',
          description: 'Successfully loaded from backend',
        });
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Only load if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [toast]);

  const handleCreateQuotation = async () => {
    try {
      const response = await apiClient.createQuotation({
        title: 'Sample Quotation',
        description: 'This is a test quotation from the frontend',
        items: [
          { name: 'Item 1', price: 100 },
          { name: 'Item 2', price: 200 },
        ],
        total: 300,
      });

      // Add to local state
      setQuotations([...quotations, response.quotation]);

      toast({
        title: 'Success',
        description: 'Quotation created successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    try {
      await apiClient.deleteQuotation(id);

      // Remove from local state
      setQuotations(quotations.filter((q) => q.id !== id));

      toast({
        title: 'Success',
        description: 'Quotation deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      setQuotations([]);
      toast({
        title: 'Logged Out',
        description: 'Successfully logged out',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="mb-4">Please login first</p>
        <Button onClick={() => window.location.href = '/login'}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* User Info Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, {user?.email}</CardTitle>
          <CardDescription>Backend integration example</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              User ID: <code className="bg-gray-100 px-2 py-1">{user?.id}</code>
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Quotations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Quotations</CardTitle>
          <CardDescription>
            Quotations synced from backend ({quotations.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button onClick={handleCreateQuotation}>
              + Create Quotation
            </Button>
          </div>

          {quotations.length === 0 ? (
            <p className="text-gray-500">No quotations yet</p>
          ) : (
            <div className="space-y-4">
              {quotations.map((quotation: any) => (
                <div
                  key={quotation.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">{quotation.title}</h3>
                    <p className="text-sm text-gray-600">
                      {quotation.description}
                    </p>
                    <p className="text-lg font-bold mt-2">
                      ${quotation.total}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteQuotation(quotation.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
        <p className="font-semibold mb-2">Debug Info:</p>
        <p>Backend URL: http://localhost:3001/api</p>
        <p>Token Stored: {localStorage.getItem('authToken') ? 'Yes' : 'No'}</p>
        <p>Quotations Loaded: {quotations.length}</p>
      </div>
    </div>
  );
}

export default DashboardExample;
