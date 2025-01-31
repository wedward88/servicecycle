import { CiCircleCheck, CiCirclePlus } from 'react-icons/ci';

interface AddToWatchListProps {
  onAdd: () => void;
  onRemove: () => void;
  isInWatchList: Boolean;
  className: string;
}

const AddToWatchList = ({
  onAdd,
  onRemove,
  isInWatchList,
  className,
}: AddToWatchListProps) => {
  return (
    <div className={className}>
      {isInWatchList ? (
        <CiCircleCheck onClick={onRemove} />
      ) : (
        <CiCirclePlus onClick={onAdd} />
      )}
    </div>
  );
};

export default AddToWatchList;
