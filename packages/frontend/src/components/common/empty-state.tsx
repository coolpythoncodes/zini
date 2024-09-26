type Props = {
  text: string;
};

const EmptyState = ({ text }: Props) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <p>{text}</p>
    </div>
  );
};

export default EmptyState;
