import IconElement from "@/components/common/icon-element";
import { type Icons } from "@/components/common/icons";

type Props = {
  text: string;
  value: string;
  icon: keyof typeof Icons;
};

const GroupInfoCard = ({ text, value, icon }: Props) => {
  return (
    <div className="space-y-5 rounded border border-[#D7D9E4B2] bg-[#F8FDF5] p-2 shadow-[0px_4px_8px_0px_#0000000D]">
      <div className="grid h-7 w-7 place-items-center rounded-full border-[0.5px] border-[#696F8C99] bg-white">
        <IconElement iconName={icon} className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        <p className="text-[8px] font-normal leading-[10px] text-black">
          {text}
        </p>
        <p className="text-xs font-medium leading-[14px] text-[#0A0F29]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default GroupInfoCard;
