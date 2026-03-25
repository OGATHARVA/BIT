import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Version {
  version_number: number;
  title?: string;
  change_notes?: string;
  created_at: string;
  created_by?: string;
}

interface VersionHistoryProps {
  versions?: Version[];
  currentVersion?: number;
  onSelectVersion?: (version: number) => void;
  loading?: boolean;
}

export function VersionHistory({
  versions = [],
  currentVersion = 1,
  onSelectVersion,
  loading = false,
}: VersionHistoryProps) {
  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Version History</CardTitle>
          <CardDescription>No versions yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Save a proposal first to start version tracking</p>
        </CardContent>
      </Card>
    );
  }

  // Sort versions by version number in descending order
  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📋 Version History</CardTitle>
        <CardDescription>Track changes to your proposal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedVersions.map((version) => {
            const isCurrentVersion = version.version_number === currentVersion;
            const dateStr = new Date(version.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={version.version_number}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isCurrentVersion
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        Version {version.version_number}
                      </h4>
                      {isCurrentVersion && (
                        <Badge className="bg-green-500 text-white">Current</Badge>
                      )}
                      <Badge variant="outline">{dateStr}</Badge>
                    </div>

                    {version.title && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Title:</strong> {version.title}
                      </p>
                    )}

                    {version.change_notes && (
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <strong>Changes:</strong> {version.change_notes}
                        </p>
                      </div>
                    )}

                    {version.created_by && (
                      <p className="text-xs text-gray-500 mt-2">
                        Created by: {version.created_by}
                      </p>
                    )}
                  </div>

                  {!isCurrentVersion && onSelectVersion && (
                    <Button
                      onClick={() => onSelectVersion(version.version_number)}
                      variant="outline"
                      size="sm"
                      className="ml-3"
                      disabled={loading}
                    >
                      Load
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Version Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 Version Management</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Create new versions when making significant changes</li>
            <li>• All versions are automatically saved with timestamps</li>
            <li>• Load previous versions to compare or reference</li>
            <li>• Keep change notes for better tracking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default VersionHistory;
