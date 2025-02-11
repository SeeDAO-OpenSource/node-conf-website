interface RuleCardProps {
  title: string;
  description: string;
  icon?: string;
}

const RuleCard = ({ title, description, icon }: RuleCardProps) => {
  return (
    <div className="rule-card">
      {icon && <span className="rule-card-icon">{icon}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
} 