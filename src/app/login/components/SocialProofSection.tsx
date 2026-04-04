import Icon from '@/components/ui/AppIcon';

interface StatItem {
  value: string;
  label: string;
  icon: string;
}

const SocialProofSection = () => {
  const stats: StatItem[] = [
    {
      value: '50K+',
      label: 'Active Users',
      icon: 'UsersIcon'
    },
    {
      value: '2M+',
      label: 'Links Created',
      icon: 'LinkIcon'
    },
    {
      value: '99.9%',
      label: 'Uptime',
      icon: 'CheckCircleIcon'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="bg-card rounded-lg shadow-md p-8 border border-border">
        <h2 className="font-heading font-semibold text-xl text-foreground text-center mb-6">
          Trusted by thousands of professionals worldwide
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Icon 
                  name={stat.icon as any} 
                  size={24} 
                  variant="outline" 
                  className="text-primary"
                />
              </div>
              <p className="font-heading font-bold text-3xl text-foreground mb-1">
                {stat.value}
              </p>
              <p className="font-body text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success" />
              <span className="font-body text-sm text-foreground">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="LockClosedIcon" size={20} variant="solid" className="text-success" />
              <span className="font-body text-sm text-foreground">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="ClockIcon" size={20} variant="solid" className="text-success" />
              <span className="font-body text-sm text-foreground">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofSection;