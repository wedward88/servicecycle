type ResultCardProps = {
  title: string;
  imgUrl: string;
  overview: string;
  firstAirDate: string;
};
1;
const ResultCard = ({
  title,
  imgUrl,
  firstAirDate,
}: ResultCardProps) => {
  return (
    <div className="card bg-base-300 shadow-xl max-w-md mx-auto rounded-3xl">
      <figure>
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-[400px] object-cover object-top"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${title} ${firstAirDate}`}</h2>
      </div>
    </div>
  );
};

export default ResultCard;
