type Props = {
  text: string;
};
const PageTitle = ({ text }: Props) => {
  return (
    <h1 className="flex-1 text-center text-base font-medium text-[#0A0F29]">
      {text}
    </h1>
  );
};

export default PageTitle;
