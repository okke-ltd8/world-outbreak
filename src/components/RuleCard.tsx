interface RuleCardProps {
  title: string;
  content: string;
}

export function RuleCard({ title, content }: RuleCardProps) {
  return (
    <div className="border-b border-outbreak-line py-4 last:border-none">
      <h4 className="font-medium text-white">{title}</h4>
      <p className="mt-1 text-sm text-outbreak-ash">{content}</p>
    </div>
  );
}
