type Props = {
  title: string;
};

const ModalTitle = ({ title }: Props) => {
  return (
    <h1 className="text-center text-lg font-semibold leading-6 text-[#0A0F29]">
      {title}
    </h1>
  );
};

export default ModalTitle;
