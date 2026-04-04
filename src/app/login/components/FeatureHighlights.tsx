import Icon from '@/components/ui/AppIcon';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const FeatureHighlights = () => {
  const features: Feature[] = [
    {
      title: 'Lightning Fast',
      description: 'Create and share shortened links in seconds with our optimized platform',
      icon: 'BoltIcon'
    },
    {
      title: 'Detailed Analytics',
      description: 'Track clicks, referrers, and performance metrics in real-time',
      icon: 'ChartBarIcon'
    },
    {
      title: 'Custom Aliases',
      description: 'Create branded, memorable links that reflect your brand identity',
      icon: 'SparklesIcon'
    },
    {
      title: 'Developer API',
      description: 'Integrate link shortening into your applications with our REST API',
      icon: 'CodeBracketIcon'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 mb-12">
      <div className="text-center mb-12">
        <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
          Why Choose LinkLab?
        </h2>
        <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
          Join thousands of professionals who trust LinkLab for their link management needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-card rounded-lg p-6 border border-border shadow-sm transition-all duration-250 ease-smooth hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Icon 
                name={feature.icon as any} 
                size={24} 
                variant="outline" 
                className="text-primary"
              />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureHighlights;