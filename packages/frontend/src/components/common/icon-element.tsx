import { Icons } from "./icons";

interface Props {
  iconName: keyof typeof Icons;
}

const IconElement = ({ iconName }: Props) => {
  const IconComponent = Icons[iconName];
  return <IconComponent />;
};

export default IconElement;
