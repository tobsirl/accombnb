const House = ({ title, picture, type, town, rating, reviewsCount }) => (
  <div>
    <img src={picture} width="100%" alt="House picture" />
    <p>
      {type} - {town}
    </p>
    <p>{title}</p>
    <p>
      {rating} ({reviewsCount})
    </p>
  </div>
);

export default House;
