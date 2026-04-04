import Icon from '@/components/ui/AppIcon';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border transition-all duration-350 hover:shadow-md hover:-translate-y-1">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        <Icon name={icon as any} size={24} variant="outline" className="text-primary" />
      </div>
      <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
        {title}
      </h3>
      <p className="font-body text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;