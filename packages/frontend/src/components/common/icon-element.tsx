import { Icons } from "./icons";

interface Props {
  iconName: keyof typeof Icons;
  className?: string;
}

const IconElement = ({ iconName, className }: Props) => {
  const IconComponent = Icons[iconName];
  return <IconComponent className={className} />;
};

export default IconElement;
