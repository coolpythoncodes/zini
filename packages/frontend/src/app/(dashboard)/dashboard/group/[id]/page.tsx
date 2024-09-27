import GroupPageClientSide from "./components/client-side";

const GroupPage = ({ params: { id } }: { params: { id: string } }) => {
  return <GroupPageClientSide {...{ id }} />;
};

export default GroupPage;
