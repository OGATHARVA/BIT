import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface RequirementFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function RequirementForm({ onSubmit, isLoading = false }: RequirementFormProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('web');
  const [complexityLevels, setComplexityLevels] = useState<any>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    projectType: 'web',
    requirements: '',
    timeline: '',
    budget: '',
    complexity: 'medium' as 'low' | 'medium' | 'high',
    features: [] as string[],
  });

  useEffect(() => {
    loadTemplatesAndLevels();
  }, []);

  const loadTemplatesAndLevels = async () => {
    try {
      const [templatesRes, levelsRes] = await Promise.all([
        apiClient.getGeneratorTemplates(),
        apiClient.getComplexityLevels(),
      ]);

      setTemplates(templatesRes.templates);
      setComplexityLevels(levelsRes.levels);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'projectType') {
      setSelectedTemplate(value);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.requirements) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  const currentTemplate = templates?.[selectedTemplate];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>📋 Project Requirements</CardTitle>
        <CardDescription>
          Provide your project details to generate a professional proposal and cost estimate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-semibold">Client & Project Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g., Acme Corporation"
                  required
                />
              </div>

              <div>
                <Label htmlFor="projectType">Project Type *</Label>
                <Select value={formData.projectType} onValueChange={(v) => handleSelectChange('projectType', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile Application</SelectItem>
                    <SelectItem value="design">Design & Branding</SelectItem>
                    <SelectItem value="consulting">Technology Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-semibold">Project Details</h3>

            <div>
              <Label htmlFor="requirements">
                Project Requirements * ({currentTemplate?.name || 'Web Application'})
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder={`Describe your ${currentTemplate?.name.toLowerCase() || 'web application'} project. Include goals, challenges, and any specific requirements.`}
                rows={5}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {currentTemplate?.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  placeholder="e.g., 8 weeks"
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., $50,000"
                />
              </div>

              <div>
                <Label htmlFor="complexity">Complexity Level</Label>
                <Select value={formData.complexity} onValueChange={(v) => handleSelectChange('complexity', v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complexityLevels?.map((level: any) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Features Selection */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="font-semibold">Required Features</h3>
            {currentTemplate?.exampleFeatures ? (
              <div className="grid gap-3 md:grid-cols-2">
                {currentTemplate.exampleFeatures.map((feature: string) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="font-normal cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select specific features for your {currentTemplate?.name.toLowerCase() || 'project'}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Selected: {formData.features.length} feature{formData.features.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Complexity Info */}
          {complexityLevels && (
            <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
              {complexityLevels.find((l: any) => l.id === formData.complexity) && (
                <>
                  <p className="font-semibold text-blue-900">
                    {complexityLevels.find((l: any) => l.id === formData.complexity).name}
                  </p>
                  <p className="text-sm text-blue-800">
                    {complexityLevels.find((l: any) => l.id === formData.complexity).description}
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    <strong>Examples:</strong>{' '}
                    {complexityLevels.find((l: any) => l.id === formData.complexity).examples.join(', ')}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">⏳</span> Generating Proposal...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span> Generate Proposal
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default RequirementForm;
